const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const { config } = require("../config");
let exclusion = [];

async function run_reaction(user, message) {
    let words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
    let result = await api_reaction(words);

    try {
        if (result.reaction !== null) {
            if (tools.get_random_int(100) <= result.frequency) {
                log_and_timeout(result, user);
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

async function api_reaction(words_in){
    const body = {
        data: [{
            method: "get_reaction",
            words_in: words_in,
            words_not_in: exclusion
        }]
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

function log_and_timeout(reaction, user){
    if (reaction.timeout > 0) {
        exclusion.push(reaction.trigger_word);

        setTimeout(function () {
            exclusion.splice(exclusion.indexOf(reaction.trigger_word), 1);
            socket.log(`[REACTION] '${reaction.trigger_word}' has been removed from the exclusion list`);
        }, reaction.timeout * 1000);

        socket.log(`[REACTION] '${reaction.trigger_word}' triggered by '${user['display-name']}' (timeout : ${tools.timeout_to_string(reaction.timeout)})`);
    }
    else{
        socket.log(`[REACTION] '${reaction.trigger_word}' triggered by '${user['display-name']}' (no timeout) `);
    }
}

module.exports = { run_reaction }