const db = require('./db.js');

var socket = null;

function init(config_init, socket_init) {
    socket = socket_init;
}

async function query_moderator(words) {
    var sql = "( 0";

    for (var word of words) {
        sql += " OR moderator.trigger_word='" + word + "'";
    }

    sql += ")";

    var res = await db.query("SELECT mod_action, explanation FROM moderator WHERE " + sql + " ORDER BY RAND() LIMIT 1");
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
    var words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    var result = await query_moderator(words);

    try {
        if (result) {
            socket.log("[MODERATOR] Taking action against '" + user['display-name'] + "' for saying '" + message + "' (Action : " + result.mod_action + ")");
            return [result.mod_action.replace("@username", user['display-name']), result.explanation.replace("@username", user['display-name'])];
        }
        return;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = { init, run }