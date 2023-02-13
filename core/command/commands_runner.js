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
            if (user && command.value) {
                command.value = command.value.replace("@username", user['display-name']);
            }

            switch(command.response_type){
                case "text":
                    return run_text(command, user);
                
                case "audio":
                    return run_audio(command, user);

                case "tank-random":
                    if (command.exclude !== null) excluded_tanks.push(command.exclude);
                    if (excluded_tanks.length == command.total) excluded_tanks = [];
                    return command.value;

                default:
                    return null;
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

function is_command_moderator_only(command, user){
    return (command.mod_only && (user.mod || user.username === config.twitch_channel))
}

function is_command_subscriber_only(command, user){
    return (command.sub_only && user.subscriber);
}

function is_command_everyone(command, user){
    (!command.mod_only && !command.sub_only)
}

function run_text(command, user) {
    if (is_command_moderator_only(command, user))
        return command.value;

    if (is_command_subscriber_only(command, user))
        return command.value;

    if (is_command_everyone(command, user))
        return command.value;
}

function run_audio(command, user) {
    if (is_command_moderator_only(command, user)) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }

    if (is_command_subscriber_only(command, user)) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }

    if (is_command_everyone(command, user)) {
        timeout_audio(command);
        socket.play_audio(command);
        return null;
    }
}

function timeout_audio(command) {
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