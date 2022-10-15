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
	const trigger_word_in = words.map(word => "?").join(",")
    const trigger_word_not_in = exclusion.map(word => "?").join(",")
    const values = []
    values.push(trigger_word_in)
    values.push(trigger_word_not_in)

	const res = await db.query(`SELECT *
                                  FROM audio
                                  WHERE audio.trigger_word IN (${trigger_word_in})
                                    AND audio.trigger_word NOT IN (${trigger_word_not_in})
                                  ORDER BY RAND() LIMIT 1`, values);
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