function randomInt(max) {
    ///Return a random number between 0 and max
    return Math.floor(Math.random() * Math.floor(max + 1));
}

function parseCommand(message, prefix) {
    ///Commande Parser, sépare commande et paramètre de commande
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z1-9]+)\s?(.*)");
    return regex.exec(message);
}

function normalizeString(str) {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function timeoutToString(seconds) {
    if(seconds >= 604800)
        return parseInt(seconds / 604800) + " week";

    if(seconds >= 86400)
        return parseInt(seconds / 86400) + " day";

    if(seconds >= 3600)
        return parseInt(seconds / 3600) + " hour";

    if(seconds >= 60)
        return parseInt(seconds / 60) + " min";

    if(seconds == 0)
        return "No timeout";

    return seconds + " sec";
}

function debugTwitchChat(channel, user, message, isSelf){
    console.error("[DEBUG-TWITCH] BEGIN");
    console.error(`Channel : ${channel}`);
    console.error(`User info :`);
    console.error(user);
    console.error(`Message : ${message}`);
    console.error(`isSelf : ${isSelf}`);
    console.error("[DEBUG-TWITCH] END\n");
}

function logTime(){
    const date = new Date;
    return `[${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}.${('00' + date.getMilliseconds()).slice(-3)}]`;
}

function simplifyUsername(username){
    return username.replace(/[-_]/g, "");
}

async function TTS(config, socket, text, username) {
    const gTTS = require('gtts');
    const gtts = new gTTS(text, config.tts_language);

    gtts.save(__dirname + '/../www/src/audio/tts.mp3', function (err, result) {
        if (err) {
            throw new Error(err);
        }

        socket.playTTS();
        socket.log(`[TTS] '${username}' said '${text}'`);
    });
}

module.exports = { parseCommand, randomInt, normalizeString, timeoutToString, debugTwitchChat, logTime, simplifyUsername, TTS}