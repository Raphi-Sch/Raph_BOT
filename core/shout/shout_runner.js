const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const socket = require("../socket");
const { config } = require("../config");

let shout_counter = 0;

async function run_shout(user, message) {
    shout_counter++;
    socket.shout_update(shout_counter, config.shout_interval);

    if (shout_counter >= config.shout_interval) {
        let result = await queryAPI(message, config.shout_language);

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

async function queryAPI(message, language) {
    const body = {
        data: [{
            method: "get_shout",
            language: language,
            message: message
        }]
    }

    const response = await fetch(config.api_url + "shout.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        let res = await response.json();
        return res.value;
    } else {
        console.error("[SHOUT] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(language);
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

module.exports = { run_shout }