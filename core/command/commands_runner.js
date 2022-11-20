const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools")
const { config } = require("../config")
const API_URL = require("../../config.json").API_URL;

let excluded_tanks = [];

async function run_command(user, message) {
    const fullCommand = tools.command_parser(message, config.cmd_prefix);

    if (fullCommand) {
        let result = await api_command(fullCommand[1], fullCommand[2]);

        // Put username if command required it
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

async function api_command(command, param){
    const body = {
        data: [{
            method: "get_command",
            command: command,
            param: param,
            excluded_tanks: excluded_tanks
        }]
    }

    const response = await fetch(API_URL + "commands.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        let json = await response.json();

        if(json.char_random){ // if true, command was '!char random'
            if (json.exclude !== null) excluded_tanks.push(json.exclude);
            if (excluded_tanks.length == json.total) excluded_tanks = [];
        }
            
        return json.value;
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

module.exports = { run_command }