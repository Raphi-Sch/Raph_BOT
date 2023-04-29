const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const socket = require("../socket");
const { config } = require("../config");

let shout_counter = 0;

async function runShout(user, message) {
    shout_counter++;
    socket.setShout(shout_counter, config.shout_interval);

    if (shout_counter >= config.shout_interval) {
        let result = await queryAPI(message, config.shout_language);

        if (result.value !== null) {
            socket.log(`[SHOUT] '${user['display-name']}' got shouted`);
            result = config.shout_prefix + " " + result.value;
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

async function queryAPI(message, language) {
    const body = {
        language: language,
        message: message
    }

    const response = await fetch(config.api_url + "shout.php?request", {
        method: "post",
        body: JSON.stringify(body),
        headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${config.token}`,
            "Client" : config.client
        }
    })

    if (response.ok) {
        return await response.json();
    } else {
        console.error("[SHOUT] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(language);
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

module.exports = { runShout }