const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");

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

    const response = await fetch(config.api_url + "commands.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        return response.json();
    } else {
        console.error("[COMMAND] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(command);
        console.error(param);
        console.error(excluded_tanks);
        console.error(excluded_audio);
        console.error("-------------------");
        return null;
    }
}

function is_command_for_moderator(command, user){
    return (command.mod_only && user && (user.mod || user.username === config.twitch_channel.toLowerCase()))
}

function is_command_for_subscriber(command, user){
    return (command.sub_only && user && user.subscriber);
}

function is_command_for_everyone(command){
    return (!command.mod_only && !command.sub_only)
}

function run_text(command, user) {
    if (is_command_for_moderator(command, user))
        return command.value;

    if (is_command_for_subscriber(command, user))
        return command.value;

    if (is_command_for_everyone(command))
        return command.value;
}

function run_audio(command, user) {
    if (is_command_for_moderator(command, user)) {
        log_and_timeout_audio(command, user);
        socket.play_audio(command);
        return null;
    }

    if (is_command_for_subscriber(command, user)) {
        log_and_timeout_audio(command, user);
        socket.play_audio(command);
        return null;
    }

    if (is_command_for_everyone(command)) {
        log_and_timeout_audio(command, user);
        socket.play_audio(command);
        return null;
    }
}

function log_and_timeout_audio(command, user) {
    if (command.timeout > 0) {
        excluded_audio.push(command.trigger_word);
        socket.log(`[AUDIO] '${command.name}' has been played by '${user['display-name']}' (timeout : ${tools.timeoutToString(command.timeout)})`);

        setTimeout(function () {
            excluded_audio.splice(excluded_audio.indexOf(command.trigger_word), 1);
            socket.log(`[AUDIO] '${command.name}' has been removed from the exclusion list`);
        }, command.timeout * 1000);
    }
    else {
        socket.log(`[AUDIO] '${command.name}' has been played by '${user['display-name']}' (no timeout)`);
    }
}

module.exports = { run_command }