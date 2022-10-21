import {run_moderator} from './moderator_runner'
import {config} from '../config'

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_moderator == 1) {
        runnable.run = (user, message) => run_moderator(user, message)
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }