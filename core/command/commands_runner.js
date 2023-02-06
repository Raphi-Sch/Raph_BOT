const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
const API_URL = require("../../config.json").API_URL;

let excluded_tanks = [];
let excluded_audio = [];

async function run_command(user, message) {
    const fullCommand = tools.command_parser(message, config.cmd_prefix);

    if (fullCommand) {
        let command = await api_command(fullCommand[1], fullCommand[2]);

        if (command) {
            // Replace @username with current username
            if (user) {
                command.value = command.value.replace("@username", user['display-name']);
            }

            // Command is mod_only / broadcaster
            if (command.mod_only && (user.mod || user.username == config.twitch_channel))
                return command.value;

            // Command is sub_only
            if (command.sub_only && user.subscriber)
                return command.value;

            // Command is for everyone
            if (!command.mod_only && !command.sub_only)
                return command.value;
        }
    }
    return null;
}

async function api_command(command, param) {
    const body = {
        data: [{
            method: "get_command",
            command: command,
            param: param,
            excluded_tanks: excluded_tanks,
            excluded_audio: excluded_audio
        }]
    }

    const response = await fetch(API_URL + "commands.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        let data = await response.json();

        // Reponse is 'text' or 'tank'
        if (data.response_type == "text" || data.response_type == "tank") {
            return data;
        }

        // Response is 'tank-random
        if (data.response_type == "tank-random") {
            if (data.exclude !== null) excluded_tanks.push(data.exclude);
            if (excluded_tanks.length == data.total) excluded_tanks = [];
            return data;
        }

        // Response is 'audio'
        if (data.response_type == "audio") {
            // Handle timeout
            if (data.timeout > 0) {
                excluded_audio.push(data.trigger_word);
                socket.log(`[AUDIO] '${data.name}' has been played (timeout : ${data.timeout}s)`);

                setTimeout(function () {
                    excluded_audio.splice(excluded_audio.indexOf(data.trigger_word), 1);
                    socket.log(`[AUDIO] '${data.name}' has been removed from the exclusion list`);
                }, data.timeout * 1000);
            }
            else {
                socket.log(`[AUDIO] '${data.name}' has been played (no timeout)`);
            }

            // Send play request
            socket.play_audio(data);

            // No result in Twitch chat
            return null;
        }

        return null;
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

module.exports = { run_command }