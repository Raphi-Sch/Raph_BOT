const db = require('./db.js');
const tools = require('./tools.js');

let exclusion = [];
let socket = null;

function init(config_init, socket_init) {
    socket = socket_init;
}

async function query_reaction(words) {
    const trigger_word_in = words.map(word => "?").join(",")

    let trigger_word_not_in = "";
    if (exclusion.length > 0) {
        trigger_word_not_in = `AND reactions.trigger_word NOT IN (${exclusion.map(word => "?").join(",")})`;

    }

    const values = [];
    values.push(words);
    values.push(exclusion);

    const res = await db.query(`SELECT trigger_word, reaction, frequency, timeout
                                FROM reactions
                                WHERE reactions.trigger_word IN (${trigger_word_in})
                                ${trigger_word_not_in}
                                ORDER BY RAND() LIMIT 1`, values);

    if (res[0]) {
        return res[0];
    }
}

async function run(user, message) {
    let words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    let result = await query_reaction(words);

    try {
        if (result) {
            if (tools.getRandomInt(100) <= result.frequency) {
                if (result.timeout > 0) {
                    exclusion.push(result.trigger_word);

                    setTimeout(function () {
                        exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
                        socket.log("[REACTION] '" + result.trigger_word + "' has been removed from the exclusion list");
                    }, result.timeout * 1000);

                    socket.log("[REACTION] '" + result.trigger_word + "' has been excluded for " + result.timeout + "s");
                }
                return result.reaction.replace("@username", user['display-name']);
            }
        }
        return;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = { init, run }