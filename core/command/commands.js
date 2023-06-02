const { runCommand } = require('./commands_runner')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Const declaration
const { config } = require('../config');
const socket = require('../socket.js');

// Global Var
let timer = 0;
let message_counter = 0;
let total_auto_cmd_time = 0;
let total_auto_cmd_msg = 0;
let last_auto_cmd = 0;

const runnable = {
    run: (user, message) => null
}

function init() {
    if (config.plugin_commands == 1) {
        socket.log("[PLUGIN] Commands enabled");
        runnable.run = (user, message) => runCommand(user, message)
    }
    else {
        socket.log("[PLUGIN] Commands disabled");
    }
}

async function timeTrigger() {
    if (config.plugin_commands == 1) {
        timer++;
        socket.setTimeCounter(timer, config.cmd_time_interval, total_auto_cmd_time);
        if (timer >= config.cmd_time_interval) {
            timer = 0;
            total_auto_cmd_time++;
            return autoCommand();
        }
    }
    return null;
}

/**
 *
 * @returns {Promise<string|*|null>}
 */
async function messageTrigger() {
    const message_interval = config.cmd_msg_interval
    message_counter++
    socket.setMessageCounter(message_counter, message_interval, total_auto_cmd_msg)
    if (message_counter >= message_interval) {
        resetMessageCounter()
        total_auto_cmd_msg++
        return autoCommand()
    }
    return null
}

function resetMessageCounter() {
    message_counter = 0
}

async function loadAutoCommand() {
    const response = await fetch(config.api_url + "commands.php?list-auto", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.token}`,
            "Client": config.client
        }
    })

    if (response.ok) {
        let json = await response.json();
        return json;

    } else {
        console.error(`[COMMAND] API ERROR : ${response.status} ${response.statusText}`);
        console.error('[COMMAND] Unable to load auto commands');
        return null;
    }
}

/**
 * Boucle des commandes automatiques
 * @returns {Promise<string|string|*|null>}
 */
async function autoCommand() {
    const list = await loadAutoCommand();

    if (list !== null) {
        let index;
        do {
            index = Math.floor(Math.random() * Math.floor(list.length));
        } while (index === last_auto_cmd && list.length > 1)

        last_auto_cmd = index;

        return run(null, config.cmd_prefix + list[index]);
    }

    return null;
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run, timeTrigger, messageTrigger }