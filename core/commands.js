// Const declaration
const tools = require('./tools.js');
const db = require('./db.js');
const tanks = require('./tanks.js');

const config = require('./config').config;
const socket = require('./socket.js');
// Global Var
let timer = 0;
let message_counter = 0;
let total_auto_cmd_time = 0;
let total_auto_cmd_msg = 0;
let last_auto_cmd = 0;
const time_interval = config.cmd_time_interval; //Trigger auto des cmd (en minutes)
const message_interval = config.cmd_msg_interval;  //Trigger auto des cmd (en nb de msg)

const runnable = {
  run: (user, message) => null
}

function init() {
  if (config.plugin_commands == 1) {
    runnable.run = (user, message) => run_command(user, message)
  }
}

async function run_command(user, message) {
  const fullCommand = tools.command_parser(message, config['cmd_prefix']);
  if (fullCommand) {
    const command = await get_alias(tools.normalize_string(fullCommand[1]));
    if (command === "char") {
      return tanks.run(tools.normalize_string(fullCommand[2]));
    }
    const result = await get_command(command);
    if (result) {
      if (user) {
        return result.replace("@username", user['display-name']);
      } else {
        return result;
      }
    }
  }
  return null;
}

async function time_trigger() {
  timer++;
  socket.time_trigger_update(timer, time_interval, total_auto_cmd_time);
  if (timer >= time_interval) {
    timer = 0;
    total_auto_cmd_time++;
    return auto_command();
  }
  return null;
}

/**
 *
 * @returns {Promise<string|*|null>}
 */
async function message_trigger() {
  message_counter++;
  socket.msg_trigger_update(message_counter, message_interval, total_auto_cmd_msg);
  if (message_counter >= message_interval) {
    message_counter = 0;
    total_auto_cmd_msg++;
    return auto_command();
  }
  return null;
}

async function load_auto_command() {
  const sql = await db.query("SELECT command FROM commands WHERE auto = 1");
  return sql.map(element => element.command);
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

async function get_alias(request) {
  const res = await db.query("SELECT command FROM alias_commands WHERE alias = ?", [request]);
  if (res[0]) {
    return res[0].command;
  }
  return request;
}

async function get_command(request) {
  const res = await db.query("SELECT value FROM commands WHERE command= ?", [request]);
  if (res[0]) {
    return res[0].value;
  }
  return null;
}

async function run(user, message) {
  return runnable.run(user, message)
}

module.exports = {init, run, time_trigger, message_trigger}