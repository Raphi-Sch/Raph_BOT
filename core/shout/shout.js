const { run_shout } = require("./shout_runner");
const { config } = require('../config');
const socket = require('../socket.js');

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_shout == 1) {
        socket.log("[PLUGIN] Shout enabled");
        runnable.run = (user, message) => run_shout(user, message)
    }
    else {
        socket.log("[PLUGIN] Shout disabled");
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }