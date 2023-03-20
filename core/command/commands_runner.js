const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");

let excluded_tanks = [];
let excluded_audio = [];

async function runCommand(user, message) {
    const fullCommand = tools.parseCommand(message, config.cmd_prefix);

    if (fullCommand) {
        let command = await queryAPI(fullCommand);

        if (command.response_type) {
            // Replace @username with current username
            if (user && command.value) {
                command.value = command.value.replace("@username", user['display-name']);
            }

            switch(command.response_type){
                case "text":
                    return runText(command, user);
                
                case "audio":
                    return runAudio(command, user);

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

async function queryAPI(fullCommand) {
    const body = {
        data: {
            method: "get_command",
            command: fullCommand[1],
            param: fullCommand[2],
            excluded_tanks: excluded_tanks,
            excluded_audio: excluded_audio
        }
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

function canUseCommandModerator(command, user){
    return (command.mod_only && user && (user.mod || user.username === config.twitch_channel.toLowerCase()))
}

function canUseCommandSubscriber(command, user){
    return (command.sub_only && user && user.subscriber);
}

function canUseCommandEveryone(command){
    return (!command.mod_only && !command.sub_only)
}

function runText(command, user) {
    if (canUseCommandModerator(command, user))
        return command.value;

    if (canUseCommandSubscriber(command, user))
        return command.value;

    if (canUseCommandEveryone(command))
        return command.value;
}

function runAudio(command, user) {
    if (canUseCommandModerator(command, user)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return null;
    }

    if (canUseCommandSubscriber(command, user)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return null;
    }

    if (canUseCommandEveryone(command)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return null;
    }
}

function logAndTimeoutAudio(command, user) {
    if (command.timeout > 0) {
        excluded_audio.push(command.trigger_word);

        setTimeout(function () {
            excluded_audio.splice(excluded_audio.indexOf(command.trigger_word), 1);
            socket.log(`[AUDIO] '${command.name}' has been removed from the exclusion list`);
        }, command.timeout * 1000);
    }
    socket.log(`[AUDIO] '${command.name}' has been played by '${user['display-name']}' (timeout : ${tools.timeoutToString(command.timeout)})`);
}

module.exports = { runCommand }