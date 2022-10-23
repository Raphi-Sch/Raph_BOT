const {run_shout} = require("./shout_runner")

// Counter
const config = require('../config').config;

const runnable = {
	run: (user, message) => null
}

function init() {
	if (config.plugin_shout == 1) {
		runnable.run = (user, message) => run_shout(user, message)
	}
}

function run(user, message) {
	return runnable.run(user, message)
}

module.exports = {init, run}