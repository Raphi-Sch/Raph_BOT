// Const declaration
const db = require('./db.js');
const tools = require('./tools.js');

// Global var
var socket = null;
var exclusion = [];

function init(config_init, socket_init){
    socket = socket_init;
}

async function query(words){
	var sql = "( 0";

	for(var word of words) {
		sql += " OR audio.trigger_word='" + word + "'";
	}	

	sql += ")"

	// Exclude
	var sql_exclude = "";
	exclusion.forEach(exclude_word => sql_exclude += " AND audio.trigger_word != '" + exclude_word + "'");

	var res = await db.query("SELECT * FROM audio WHERE " + sql + sql_exclude + " ORDER BY RAND() LIMIT 1");
    try {
        if(res[0]){
            return res[0];
        }
        return;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function run(user, message){
    var words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
	var result = await query(words);

	try {
        if(result){
			if(tools.getRandomInt(100) <= result.frequency){
                // Handle timeout
				if(result.timeout > 0){
					exclusion.push(result.trigger_word);
                    socket.log("[AUDIO] '" + result.name + "' has been excluded for " + result.timeout + "s");
					
					setTimeout(function() {
						exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
						socket.log("[AUDIO] '" + result.name + "' has been removed from the exclusion list");
					}, result.timeout * 1000);
				}

                // Send play request
                socket.play_audio(result.file, result.volume);

				return true;
			}
        }
        return false;
    }
    catch (err){
        console.error(err);
        return false;
    }
}

module.exports = {init, run}