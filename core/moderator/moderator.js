const {run_moderator} = require('./moderator_runner')
const {config} = require('../config')

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