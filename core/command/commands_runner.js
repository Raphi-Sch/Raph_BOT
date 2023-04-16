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
                    runAudio(command, user);
                    break;

                case "tank-random":
                    result = runTankRandom(command, user);
                    break;

                case "tts":
                    runTTS(command, user);
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

function canUseCommand(command, user){
    // Mod Only
    if (command.mod_only && user && (user.mod || user.username === config.twitch_channel.toLowerCase()))
        return true;

    // Sub only
    if (command.sub_only && user && user.subscriber)
        return true;

    // Everyone
    if (!command.mod_only && !command.sub_only)
        return true;

    return false
}

function runText(command, user) {
    if (user)
        command.value = command.value.replace("@username", user['display-name']);

    if(canUseCommand(command, user))
        return command.value;

    return null;
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
    if (canUseCommand(command, user)) {
        if (command.timeout > 0) {
            excluded_audio.push(command.trigger_word);
    
            setTimeout(function () {
                excluded_audio.splice(excluded_audio.indexOf(command.trigger_word), 1);
                socket.log(`[AUDIO] '${command.name}' has been removed from the exclusion list`);
            }, command.timeout * 1000);
        }
        socket.log(`[AUDIO] '${command.name}' has been played by '${user['display-name']}' (timeout : ${tools.timeoutToString(command.timeout)})`);
        socket.playAudio(command);
    }
}

function runTTS(command, user) {
    if (command.tts_type == 'user') {
        if (config.tts_prefix !== null && user) {
            command.value = (config.tts_prefix).replace("@username", tools.simplifyUsername(user['display-name'])) + " " + command.value;
        }
        tools.TTS(config, socket, command.value, user['display-name']);
    }

    if (command.tts_type == 'bot') {
        if (config.tts_prefix !== null) {
            command.value = (config.tts_prefix).replace("@username", "raphbote") + " " + command.value;
        }
        if (user) {
            command.value = command.value.replace("@username", tools.simplifyUsername(user['display-name']));
        }
        tools.TTS(config, socket, command.value, 'Raph_BOT');
    }
}

module.exports = { runCommand }