const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const socket = require("../socket");
const { config } = require("../config");
const API_URL = require("../../config.json").API_URL;

let shout_counter = 0;

async function run_shout(user, message) {
    shout_counter++;
    socket.shout_update(shout_counter, config.shout_interval);

    if (shout_counter >= config.shout_interval) {
        let result = await api_shout(message, "fr");

        if (result) {
            socket.log(`[SHOUT] '${user['display-name']}' got shouted`);

            result = result.replace("@username", user['display-name']);
            shout_counter = 0;

            return result;
        } else {
            shout_counter = config.shout_interval - 1;
            return null;
        }
    }
    return null;
}

async function api_shout(message, language) {
    const body = {
        data: [{
            method: "get_shout",
            language: language,
            message: message
        }]
    }

    const response = await fetch(API_URL + "shout.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        let res = await response.json();
        return res.value;
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

module.exports = { run_shout }