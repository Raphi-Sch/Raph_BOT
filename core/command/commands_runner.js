const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
const { re } = require('@babel/core/lib/vendor/import-meta-resolve');

let excludedTanks = [];
const tts = {
    timeoutStart: 0,
    timeoutTotal: 0
}
const audio = {
    timeoutStart: 0,
    timeoutTotal: 0,
    excluded: []
}

async function runCommand(user, message) {
    let result = null;

    // Parse command
    const fullCommand = tools.parseCommand(message, config.cmd_prefix);

    if (fullCommand) {
        let command = await queryAPI(fullCommand);

        // Default result is true, to stop processing even if command is unknown. Maybe the command is for another bot
        result = true;

        if (command !== null && command.response_type) {
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
        tanks_excluded: excludedTanks,
        tts_timeout: getTimeLeft(tts),
        audio_timeout: getTimeLeft(audio),
        audio_excluded: audio.excluded
    }

    if (config.debug_level <= 2) {
        console.error(`${tools.logTime()} [COMMANDS] Data send to API :`);
        console.error(body);
    }

    const response = await fetch(config.api_url + "commands.php?request", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.token}`,
            "Client": config.client
        }
    })

    if (response.ok) {
        return response.json();
    } else {
        console.error(`[COMMAND] API ERROR : ${response.status} ${response.statusText}`);
        console.error("Context : ");
        console.error(body);
        console.error("-------------------");
        return null;
    }
}

function canUseCommand(command, user) {
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

    if (canUseCommand(command, user))
        return command.value;

    return null;
}

function runTankRandom(command, user) {
    if (user)
        command.value = command.value.replace("@username", user['display-name']);

    if (command.exclude !== null)
        excludedTanks.push(command.exclude);

    if (excludedTanks.length == command.total)
        excludedTanks = [];

    return command.value
}

function runAudio(command, user) {
    if (canUseCommand(command, user)) {
        if (command.timeout > 0) {
            audio.excluded.push(command.trigger_word);

            // Specific timeout
            setTimeout(function () {
                audio.excluded.splice(audio.excluded.indexOf(command.trigger_word), 1);
                socket.log(`[AUDIO] '${command.name}' has been removed from the exclusion list`);
            }, parseInt(command.timeout) * 1000);
        }

        // Global timeout
        audio.timeoutStart = Date.now();
        audio.timeoutTotal = parseInt(command.global_timeout);
        setTimeout(function () {
            audio.timeoutStart = 0
            socket.log(`[AUDIO] Global timeout over.`);
        }, audio.timeoutTotal * 1000);

        socket.log(`[AUDIO] '${command.name}' has been played by '${user['display-name']}' (timeout : ${tools.timeoutToString(command.timeout)})`);
        socket.log(`[AUDIO] Global timeout set (${tools.timeoutToString(audio.timeoutTotal)})`);

        socket.playAudio(command);
    }
}

function runTTS(command, user) {
    if (user && command.tts_type == 'user') {
        if (!canUseCommand(command, user)) {
            if (config.debug_level >= 1) {
                console.error(`[TTS] Access denied to ${user['display-name']}`);
            }
            return true;
        }

        tts.timeoutStart = Date.now();
        tts.timeoutTotal = parseInt(command.timeout);
        setTimeout(() => {
            socket.log(`[TTS] Timeout over.`);
            tts.timeoutStart = 0;
        }, tts.timeoutTotal * 1000);

        command.value = command.value.replace("@username", tools.simplifyUsername(user['display-name']));
        tools.TTS(config, socket, command.value, user['display-name']);
        socket.log(`[TTS] Timeout for ${tools.timeoutToString(parseInt(command.timeout))}`);
    }

    if (command.tts_type == 'bot') {
        if (user) {
            command.value = command.value.replace("@username", tools.simplifyUsername(user['display-name']));
        }
        tools.TTS(config, socket, command.value, 'Raph_BOT');
    }

    return true; // No text output, but command success
}

function getTimeLeft(obj){
    return (obj.timeoutStart != 0 ? Math.ceil(obj.timeoutTotal - (Date.now() - obj.timeoutStart) / 1000) : 0);
}

module.exports = { runCommand }