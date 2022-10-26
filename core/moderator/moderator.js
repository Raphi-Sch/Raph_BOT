const { run_moderator } = require('./moderator_runner');
const { config } = require('../config');
const socket = require('../socket.js');

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_moderator == 1) {
        socket.log("[PLUGIN] Moderator enabled");
        runnable.run = (user, message) => run_moderator(user, message)
    }
    else {
        socket.log("[PLUGIN] Moderator disabled");
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }