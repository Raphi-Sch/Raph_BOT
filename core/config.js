import db from './db'

const config = {
  bot_name: null,
  cmd_msg_interval: null,
  cmd_prefix: null,
  cmd_time_interval: null,
  discord_channel_1: null,
  discord_channel_2: null,
  discord_notification: null,
  discord_token: null,
  plugin_audio: null,
  plugin_commands: null,
  plugin_moderator: null,
  plugin_reaction: null,
  plugin_shout: null,
  shout_interval: null,
  twitch_channel: null,
  twitch_connection_message: null,
  twitch_token: null
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

module.exports = {load, config}