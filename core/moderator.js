const db = require('./db.js');
const tools = require('./tools.js');
const socket = require('./socket.js');
const {config} = require("./config");
const {re} = require("@babel/core/lib/vendor/import-meta-resolve");

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_moderator == 1) {
        runnable.run = (user, message) => run_moderator(user, message)
    }
}
async function query_moderator(words) {
    const trigger_word_in = words.map(() => "?").join(",")
    const res = await db.query(`SELECT mod_action, explanation
                                  FROM moderator
                                  WHERE moderator.trigger_word IN (${trigger_word_in})
                                  ORDER BY RAND() LIMIT 1`, words);

    return tools.first_of_array(res);
}

async function run_moderator(user, message) {
    const words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    const result = await query_moderator(words);

    try {
        if (result) {
            socket.log(`[MODERATOR] Taking action against ${user['display-name']} for saying ${message} (Action : ${result.mod_action} )`);

            result.mod_action = result.mod_action.replace("@username", user['display-name']);
            result.explanation = result.explanation.replace("@username", user['display-name']);

            return result;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }