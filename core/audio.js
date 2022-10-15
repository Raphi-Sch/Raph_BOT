// Const declaration
const db = require('./db.js');
const tools = require('./tools.js');

// Global var
let socket = null;
let exclusion = [];

function init(config_init, socket_init) {
    socket = socket_init;
}

async function query(words) {
    const trigger_word_in = words.map(words => "?").join(",")
    let trigger_word_not_in = "";

    if (exclusion.length > 0) {
        trigger_word_not_in = `AND audio.trigger_word NOT IN (${exclusion.map(word => "?").join(",")})`;

    }

    const values = [];
    values.push(words);
    values.push(exclusion);

    const res = await db.query(`SELECT *
                                FROM audio
                                WHERE audio.trigger_word IN (${trigger_word_in})
                                ${trigger_word_not_in}
                                ORDER BY RAND() LIMIT 1`, values);

    if (res[0]) {
        return res[0];
    }
}

async function run(user, message) {
    const words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
    const result = await query(words);

    try {
        if (result) {
            if (tools.getRandomInt(100) <= result.frequency) {
                // Handle timeout
                if (result.timeout > 0) {
                    exclusion.push(result.trigger_word);
                    socket.log("[AUDIO] '" + result.name + "' has been excluded for " + result.timeout + "s");

                    setTimeout(function () {
                        exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
                        socket.log("[AUDIO] '" + result.name + "' has been removed from the exclusion list");
                    }, result.timeout * 1000);
                }

                // Send play request
                socket.play_audio(result);

                return true;
            }
        }
        return false;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = { init, run }