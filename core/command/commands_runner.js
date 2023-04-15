const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
const { re } = require('@babel/core/lib/vendor/import-meta-resolve');
const gTTS = require('gtts');

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
            // Replace @username with current username
            if (user && command.value) {
                command.value = command.value.replace("@username", user['display-name']);
            }

            switch (command.response_type) {
                case "text":
                    result = runText(command, user);
                    break;

                case "audio":
                    runAudio(command, user);
                    break;

                case "tank-random":
                    if (command.exclude !== null) excluded_tanks.push(command.exclude);
                    if (excluded_tanks.length == command.total) excluded_tanks = [];
                    result = command.value
                    break;

                case "tts":
                    runTTS(command.value, user['display-name']);
                    break;

                case "tts-bot":
                    runTTS(command.value, 'RaphBOTE');
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

async function runTTS(text, username) {
    if(username && config.tts_prefix){
        text = (config.tts_prefix + " " + text).replace("@username", tools.simplifyUsername(username));
    }
        
    const gtts = new gTTS(text, config.tts_language);

    gtts.save(__dirname + '/../../www/src/audio/tts.mp3', function (err, result) {
        if (err) { 
            throw new Error(err); 
        }

        socket.playTTS();
        socket.log(`[TTS] '${username}' said '${text}'`);
    });
}

module.exports = { runCommand }