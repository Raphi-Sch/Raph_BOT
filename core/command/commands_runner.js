const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
const { re } = require('@babel/core/lib/vendor/import-meta-resolve');

let excluded_tanks = [];
let excluded_audio = [];

async function runCommand(user, message) {
    let result = null;

    // Parse command
    const fullCommand = tools.parseCommand(message, config.cmd_prefix);

    if (fullCommand) {
        let command = await queryAPI(fullCommand);

        // Default result is true, to stop processing even if command is unknown. Maybe the command is for another bot
        result = true;

        if (command.response_type) {
            switch (command.response_type) {
                case "text":
                    result = runText(command, user);
                    break;

                case "audio":
                    result = runAudio(command, user);
                    break;

                case "tank-random":
                    result = runTankRandom(command, user);
                    break;

                case "tts":
                case "tts-bot":
                    result = runTTS(command, user);
                    break;

                default:
                    break;
            }
        }

        // Log if user issued command
        if (user && result !== null && result !== true)
            socket.log(`[COMMANDS] '${fullCommand[1]}' has been used by '${user['display-name']}'`);

    }

    return result;
}

async function queryAPI(fullCommand) {
    const body = {
        command: fullCommand[1],
        param: fullCommand[2],
        excluded_tanks: excluded_tanks,
        excluded_audio: excluded_audio
    }

    const response = await fetch(config.api_url + "commands.php?request", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        return response.json();
    } else {
        console.error("[COMMAND] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(body);
        console.error("-------------------");
        return null;
    }
}

function canUseCommandModerator(command, user) {
    return (command.mod_only && user && (user.mod || user.username === config.twitch_channel.toLowerCase()))
}

function canUseCommandSubscriber(command, user) {
    return (command.sub_only && user && user.subscriber);
}

function canUseCommandEveryone(command) {
    return (!command.mod_only && !command.sub_only)
}

function runText(command, user) {
    if (user)
        command.value = command.value.replace("@username", user['display-name']);

    if (canUseCommandModerator(command, user))
        return command.value;

    if (canUseCommandSubscriber(command, user))
        return command.value;

    if (canUseCommandEveryone(command))
        return command.value;
}

function runTankRandom(command, user) {
    if (user)
        command.value = command.value.replace("@username", user['display-name']);

    if (command.exclude !== null)
        excluded_tanks.push(command.exclude);

    if (excluded_tanks.length == command.total)
        excluded_tanks = [];

    return command.value
}

function runAudio(command, user) {
    if (canUseCommandModerator(command, user)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return true;
    }

    if (canUseCommandSubscriber(command, user)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return true;
    }

    if (canUseCommandEveryone(command)) {
        logAndTimeoutAudio(command, user);
        socket.playAudio(command);
        return true;
    }

    return null;
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

function runTTS(command, user) {
    if (command.response_type == 'tts') {
        if (config.tts_prefix !== null && user) {
            command.value = (config.tts_prefix).replace("@username", tools.simplifyUsername(user['display-name'])) + " " + command.value;
        }
        tools.TTS(config, socket, command.value, user['display-name']);
        return true;
    }

    if (command.response_type == 'tts-bot') {
        if (config.tts_prefix !== null) {
            command.value = (config.tts_prefix).replace("@username", "raphbote") + " " + command.value;
        }
        if (user) {
            command.value = command.value.replace("@username", tools.simplifyUsername(user['display-name']));
        }
        tools.TTS(config, socket, command.value, 'Raph_BOT');
        return true;
    }

    return null;
}

module.exports = { runCommand }