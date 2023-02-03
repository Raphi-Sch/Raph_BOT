const db = require('./db')

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
    const sql = await db.query("SELECT * FROM config")
    try {
        sql.forEach(element => {
            config[element.id] = element.value;
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = { load, config }