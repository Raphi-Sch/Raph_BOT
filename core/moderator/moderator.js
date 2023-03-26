const { runModerator } = require('./moderator_runner');
const { config } = require('../config');
const socket = require('../socket.js');

const runnable = {
    run: (user, message, twitchAPI) => null
}

function init() {
    if (config.plugin_moderator == 1) {
        socket.log("[PLUGIN] Moderator enabled");
        runnable.run = (user, message, twitchAPI) => runModerator(user, message, twitchAPI);
    }
    else {
        socket.log("[PLUGIN] Moderator disabled");
    }
}

function run(user, message, twitchAPI) {
    return runnable.run(user, message, twitchAPI)
}

module.exports = { init, run }