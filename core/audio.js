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
    const filtered_words = words.filter(word => word !== '' && word !== null)
    const trigger_word_in = filtered_words.map(() => "?").join(",")

    let trigger_word_not_in = "";

    if (exclusion.length > 0) {
        trigger_word_not_in = `AND audio.trigger_word NOT IN (${exclusion.map(word => "?").join(",")})`;
    }

    const values = [];
    filtered_words.forEach(word => values.push(word))
    exclusion.forEach(word => values.push(word))

    const res = await db.query(`SELECT *
                                FROM audio
                                WHERE audio.trigger_word IN (${trigger_word_in})
                                ${trigger_word_not_in}
                                ORDER BY RAND() LIMIT 1`, values);

    return tools.first_of_array(res);
}

async function run(user, message) {
    const words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
    const result = await query(words);

    try {
        if (result) {
            if (tools.get_random_int(100) <= result.frequency) {
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