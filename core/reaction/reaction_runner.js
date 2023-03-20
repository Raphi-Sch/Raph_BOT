const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
let exclusion = [];

async function runReaction(user, message) {
    let result = await queryAPI(message);

    try {
        if (result.reaction !== null) {
            if (tools.randomInt(100) <= result.frequency) {
                logAndTimeout(result, user);
                return result.reaction.replace("@username", user['display-name']);
            }
        }
    } catch (err) {
        console.error("[REACTION] CORE ERROR");
        console.error(err);
        console.error("Context : ");
        console.error(user);
        console.error(message);
        return null;
    }
}

async function queryAPI(message) {
    const body = {
        method: "get_reaction",
        message: message,
        exclusion: exclusion
    }

    const response = await fetch(config.api_url + "reactions.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        return await response.json();
    } else {
        console.error("[REACTION] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(words_in);
        console.error(exclusion);
        console.error("-------------------");
        return null;
    }
}

function logAndTimeout(reaction, user) {
    if (reaction.timeout > 0) {
        exclusion.push(reaction.trigger_word);

        setTimeout(function () {
            exclusion.splice(exclusion.indexOf(reaction.trigger_word), 1);
            socket.log(`[REACTION] '${reaction.trigger_word}' has been removed from the exclusion list`);
        }, reaction.timeout * 1000);
    }
    socket.log(`[REACTION] '${reaction.trigger_word}' triggered by '${user['display-name']}' (timeout : ${tools.timeoutToString(reaction.timeout)})`);
}

module.exports = { runReaction }