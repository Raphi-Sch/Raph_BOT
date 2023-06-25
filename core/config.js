const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const configFile = require("./config.json");

const config = {
    // From file
    apiUrl: configFile.API_URL,
    apiClient: configFile.client,
    apiToken: configFile.token,
    socket_port: configFile.socket_port,
    socket_protocol: configFile.socket_protocol,
    https_key: configFile.https_key,
    https_cert: configFile.https_cert,

    // From DB
    bot_name: "",
    cmd_msg_interval: 0,
    cmd_prefix: "",
    cmd_time_interval: 0,
    debug_level: 0,
    gui_force_update: 0,
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

async function load_global(){
    const response = await fetch(config.apiUrl + "config.php?list", {
        method: "get",
        headers: { 
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${config.apiToken}`,
            "Client" : config.apiClient
        }
    })

    if (response.ok) {
        const data = await response.json();

        for (const neddle in data) {
            config[data[neddle].id] = data[neddle].value;
        }

        return null;
    } else {
        console.error("Unable to load general configuration from API, starting aborted.")
        console.error(`API ERROR : ${response.status} ${response.statusText}`);
        process.exit(1);
    }
}

async function load_commands(){
    const response = await fetch(config.apiUrl + "commands.php?list-config", {
        method: "get",
        headers: { 
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${config.apiToken}`,
            "Client" : config.apiClient
        }
    })

    if (response.ok) {
        const data = await response.json();

        for (const neddle in data) {
            if(data[neddle].id == "global_prefix"){
                config.cmd_prefix = data[neddle].value;
            }

            if(data[neddle].id == "global_interval_message"){
                config.cmd_msg_interval = data[neddle].value;
            }

            if(data[neddle].id == "global_interval_time"){
                config.cmd_time_interval = data[neddle].value;
            }
        }

        return null;
    } else {
        console.error("Unable to load commands configuration from API, starting aborted.")
        console.error(`API ERROR : ${response.status} ${response.statusText}`);
        process.exit(1);
    }
}

async function load() {
    await load_global();

    if(config.plugin_commands == 1)
        await load_commands();

    if(config.debug_level >= 2){
        console.error("[CONFIG] Currently loaded :");
        console.error(config);
    }        

    return null;
}

module.exports = { load, config }