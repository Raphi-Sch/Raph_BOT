const db = require('./db.js');
var socket = null;

// Counter
var shout_interval;
var shout_counter = 0;

function init(config_init, socket_init){
	socket = socket_init;
	shout_interval = config_init.shout_interval;
}

async function load_shout_words(){
    var sql = await db.query("SELECT * FROM shout");
    var result = [];

    try {
        sql.forEach(element => {result[element.original] = element.replacement});
        return result;
    }
    catch (err){
        console.error(err);
    }
}

async function run(user, message){
	shout_counter++;
	socket.shout_update(shout_counter, shout_interval);

	if(shout_counter > shout_interval){
		var res = await run_french(user, message);
		if(res){
			shout_counter = 0;
			return res;
		}
		else {
			shout_counter = shout_interval - 1;
			return null;
		}
	}
}

async function run_french(user, message){
	// Load shout remplacement
	var shout_words = await load_shout_words();

	//Split words of the sentence
	var word_array = message.toLowerCase().split(" ");

	//Do not take sentences too long
	if(word_array.length > 15)
		return false;

	message = "";
	var replaced_word = "";

	for(var word of word_array){
		//If the word can not be replaced it does not change, otherwise it is modified
		replaced_word = (shout_words[word] ? shout_words[word] : word);

		//If the word contains "'", special treatment to replace the left and right part
		if(word.includes("'")){
			//Split word with "'" in it
			var word_split = word.split("'");
			var replaced_word_L = shout_words[word_split[0]];
			var replaced_word_R = shout_words[word_split[1]];
			
			//If left side or right side of the word can be replaced
			if(replaced_word_L && replaced_word_R){
				replaced_word = replaced_word_L + "'" + replaced_word_R;;
			}
		}

		//Add the word to the message
		message += replaced_word + " ";
	}

	return "AH OUAIS @" + user["display-name"] + ", " + message.toUpperCase() + "!";
}

module.exports = {init, run}