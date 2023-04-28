const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config_file = require("./config.json");

const config = {
    // From file
    api_url: config_file.API_URL,
    socket_port: config_file.socket_port,
    client: config_file.client,
    token: config_file.token,

    // From DB
    bot_name: "",
    cmd_msg_interval: 0,
    cmd_prefix: "",
    cmd_time_interval: 0,
    debug_level: 0,
    force_gui_update: 0,
    plugin_commands: 0,
    plugin_moderator: 0,
    plugin_reaction: 0,
    plugin_shout: 0,
    plugin_tanks: 0,
    shout_interval: 0,
    shout_language: "",
    shout_prefix: "",
    tts_language: "",
    twitch_channel: "",
    twitch_client_id: "",
    twitch_connection_message: "",
    twitch_token: "",
    twitch_display_name: "",
};

async function load() {
    const response = await fetch(config.api_url + "config.php?list", {
        method: "get",
        headers: { 
            "Content-Type" : "application/json",
            "Authorization" : `Basic ${config.token}`,
            "Client" : config.client
        }
        
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
        console.error(`API ERROR : ${response.status} ${response.statusText}`);
        process.exit(1);
    }
}

module.exports = { load, config }