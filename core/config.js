const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_URL = require("../config.json").API_URL;

const config = {
    bot_name: null,
    cmd_msg_interval: null,
    cmd_prefix: null,
    cmd_time_interval: null,
    plugin_commands: null,
    plugin_moderator: null,
    plugin_reaction: null,
    plugin_shout: null,
    shout_interval: null,
    shout_language: null,
    twitch_channel: null,
    twitch_connection_message: null,
    twitch_token: null,
    twitch_display_name: null
};

async function load() {
    const response = await fetch(API_URL + "config.php?config", {
        method: "get",
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        const data = await response.json();

        for (const neddle in data) {
            config[neddle] = data[neddle];
        }
        
        return null;
    } else {
        console.error("Unable to load configuration from API, starting aborted.")
        console.error("API ERROR : " + response.status);
        process.exit(1);
    }
}

module.exports = { load, config }