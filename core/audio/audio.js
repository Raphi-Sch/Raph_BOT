const { run_audio } = require("./audio_runner");
const { config } = require("../config");
const socket = require('../socket.js');

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_audio == 1) {
        socket.log("[PLUGIN] Audio enabled");
        runnable.run = (user, message) => run_audio(user, message)
    }
    else {
        socket.log("[PLUGIN] Audio disabled");
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }