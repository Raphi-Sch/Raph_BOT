import tools from "../tools";
import {config} from "../config";
import tanks from "../tanks";
import db from "../db";

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

module.exports = {run_command}