const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const tools = require("../tools");
const socket = require("../socket");
const API_URL = require("../../config.json").API_URL;

// Global var
let exclusion = [];

function run_audio(user, message) {
    const words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
    const result = api_audio(words);

    try {
        if (result) {
            if (tools.get_random_int(100) <= result.frequency) {
                // Handle timeout
                if (result.timeout > 0) {
                    exclusion.push(result.trigger_word);
                    socket.log(`[AUDIO] ${result.name} has been excluded for ${result.timeout}s`);

                    setTimeout(function () {
                        exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
                        socket.log(`[AUDIO] ${result.name} has been removed = require(the exclusion list`);
                    }, result.timeout * 1000);
                }

                // Send play request
                socket.play_audio(result);
            }
        }
    }
    catch (err) {
        console.error(err);
    }

    return null;
}

async function api_audio(words_in){
    const body = {
        data: [{
            method: "get_audio",
            words_in: words_in,
            words_not_in: exclusion
        }]
    }

    const response = await fetch(API_URL + "audio.php", {
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

module.exports = { run_audio }