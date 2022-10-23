const {config} = require('../config.js')
const {run_reaction} = require('./reaction_runner')

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_reaction == 1) {
        runnable.run = (user, message) => run_reaction(user, message)
    }
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run }