const db = require('./db.js');

let socket = null;

function init(config_init, socket_init) {
    socket = socket_init;
}

async function query_moderator(words) {
    const trigger_word_in = words.map(word => "?").join(",")
    const res = await db.query(`SELECT mod_action, explanation
                                  FROM moderator
                                  WHERE moderator.trigger_word IN (${trigger_word_in})
                                  ORDER BY RAND() LIMIT 1`, words);
    try {
        if (res[0]) {
            return res[0];
        }
        return;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

async function run(user, message) {
    const words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    const result = await query_moderator(words);

    try {
        if (result) {
            socket.log("[MODERATOR] Taking action against '" + user['display-name'] + "' for saying '" + message + "' (Action : " + result.mod_action + ")");

            result.mod_action = result.mod_action.replace("@username", user['display-name']);
            result.explanation = result.explanation.replace("@username", user['display-name']);

            return result;
        }
        return;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = { init, run }