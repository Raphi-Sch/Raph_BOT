const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const API_URL = require("../../config.json").API_URL;

let exclusion = [];

async function run_reaction(user, message) {
    let words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
    let result = await api_reaction(words);

    try {
        if (result) {
            if (tools.get_random_int(100) <= result.frequency) {
                if (result.timeout > 0) {
                    exclusion.push(result.trigger_word);

                    setTimeout(function () {
                        exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
                        socket.log(`[REACTION] ${result.trigger_word} has been removed from the exclusion list`);
                    }, result.timeout * 1000);

                    socket.log(`[REACTION] ${result.trigger_word} has been excluded for ${result.timeout}s`);
                }
                return result.reaction.replace("@username", user['display-name']);
            }
        }
    } catch (err) {
        console.error(err);
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

    const response = await fetch(API_URL + "reactions.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

module.exports = { run_reaction }