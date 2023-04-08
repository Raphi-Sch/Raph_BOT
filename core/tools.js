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
    console.error("------------------");
    console.error("Channel : ");
    console.error(channel);
    console.error("User : ");
    console.error(user);
    console.error("Message : ");
    console.error(message);
    console.error(`isSelf : ${isSelf}`);
}

module.exports = { parseCommand, randomInt, normalizeString, timeoutToString, debugTwitchChat }