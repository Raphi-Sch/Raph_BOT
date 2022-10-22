// Const declaration
import {config} from "../config"
import {run_audio} from "./audio_runner"

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_audio == 1) {
        runnable.run = (user, message) => run_audio(user, message)
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = {init, run}