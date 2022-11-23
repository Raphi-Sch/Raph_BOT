const { run_command } = require('./commands_runner')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_URL = require("../../config.json").API_URL;

// Const declaration
const { config } = require('../config')
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
        runnable.run = (user, message) => run_command(user, message)
    }
    else {
        socket.log("[PLUGIN] Commands disabled");
    }
}

async function time_trigger() {
    const time_interval = config.cmd_time_interval;
    timer++;
    socket.time_trigger_update(timer, time_interval, total_auto_cmd_time);
    if (timer >= time_interval) {
        reboot_timer()
        total_auto_cmd_time++;
        return auto_command();
    }
    return null;
}

function reboot_timer() {
    timer = 0
}

/**
 *
 * @returns {Promise<string|*|null>}
 */
async function message_trigger() {
    const message_interval = config.cmd_msg_interval
    message_counter++
    socket.msg_trigger_update(message_counter, message_interval, total_auto_cmd_msg)
    if (message_counter >= message_interval) {
        reboot_message_counter()
        total_auto_cmd_msg++
        return auto_command()
    }
    return null
}

function reboot_message_counter() {
    message_counter = 0
}

async function load_auto_command() {
    const response = await fetch(API_URL + "commands.php?auto_command", {
        method: "get",
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        let json = await response.json();
        return json;

    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

/**
 * Boucle des commandes automatiques
 * @returns {Promise<string|string|*|null>}
 */
async function auto_command() {
    const list = await load_auto_command();
    let index;
    do {
        index = Math.floor(Math.random() * Math.floor(list.length));
    } while (index === last_auto_cmd && list.length > 1)

    last_auto_cmd = index;

    return run(null, config.cmd_prefix + list[index]);
}

function run(user, message) {
    return runnable.run(user, message)
}

module.exports = { init, run, time_trigger, message_trigger, reboot_message_counter, reboot_timer }