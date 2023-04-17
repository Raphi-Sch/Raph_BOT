const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config_file = require("../config.json");

const config = {
    // From file
    api_url: config_file.API_URL,
    socket_port: config_file.socket_port,

    // From DB
    bot_name: null,
    cmd_msg_interval: 0,
    cmd_prefix: null,
    cmd_time_interval: 0,
    debug_level: 0,
    force_gui_update: 0,
    plugin_commands: null,
    plugin_moderator: null,
    plugin_reaction: null,
    plugin_shout: null,
    plugin_tanks: null,
    shout_interval: 0,
    shout_language: null,
    shout_prefix: null,
    tts_character_limit: 0,
    tts_character_limit_postfix: null,
    tts_language: null,
    tts_prefix: null,
    twitch_channel: null,
    twitch_client_id: null,
    twitch_connection_message: null,
    twitch_token: null,
    twitch_display_name: null,
};

async function load() {
    const response = await fetch(config.api_url + "config.php?list", {
        method: "get",
        headers: { "Content-Type": "application/json" }
    })

    if (response.ok) {
        const data = await response.json();

        for (const neddle in data) {
            config[data[neddle].id] = data[neddle].value;
        }

        if(config.debug_level >= 2){
            console.error("[CONFIG] Currently loaded :");
            console.error(config);
        }        

        return null;
    } else {
        console.error("Unable to load configuration from API, starting aborted.")
        console.error("API ERROR : " + response.status);
        process.exit(1);
    }
}

module.exports = { load, config }