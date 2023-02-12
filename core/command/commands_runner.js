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

        if (command.response_type) {
            // Replace @username with current username
            if (user && command.response_type != 'audio') {
                command.value = command.value.replace("@username", user['display-name']);
            }

            // Command is 'text'
            if (command.response_type == "text") {
                return run_text(command, user);
            }

            // Response is 'audio'
            if (command.response_type == "audio") {
                return run_audio(command, user);
            }

            // Command is 'tank'
            if (command.response_type == "tank") {
                return command.value;
            }

            // Command is 'tank-random
            if (command.response_type == "tank-random") {
                if (command.exclude !== null) excluded_tanks.push(command.exclude);
                if (excluded_tanks.length == command.total) excluded_tanks = [];
                return command.value;
            }
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
        return response.json();
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

function run_text(command, user) {
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

function run_audio(command, user) {
    // Audio command is mod_only / broadcaster
    if (command.mod_only && (user.mod || user.username == config.twitch_channel)) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }

    // Audio command is sub_only
    if (command.sub_only && user.subscriber) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }

    // Audio command is for everyone
    if (!command.mod_only && !command.sub_only) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }
}

function timeout_audio(command) {
    // Handle timeout
    if (command.timeout > 0) {
        excluded_audio.push(command.trigger_word);
        socket.log(`[AUDIO] '${command.name}' has been played (timeout : ${command.timeout}s)`);

        setTimeout(function () {
            excluded_audio.splice(excluded_audio.indexOf(command.trigger_word), 1);
            socket.log(`[AUDIO] '${command.name}' has been removed from the exclusion list`);
        }, command.timeout * 1000);
    }
    else {
        socket.log(`[AUDIO] '${command.name}' has been played (no timeout)`);
    }
}

module.exports = { run_command }