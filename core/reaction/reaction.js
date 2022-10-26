const { run_reaction } = require('./reaction_runner');
const { config } = require('../config.js');
const socket = require('../socket.js');

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_reaction == 1) {
        socket.log("[PLUGIN] Reaction enabled");
        runnable.run = (user, message) => run_reaction(user, message)
    }
    else {
        socket.log("[PLUGIN] Reaction disabled");
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }