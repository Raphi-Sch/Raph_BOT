const version = "v5.6.2";

const db = require('./db.js');
const socket = require('./socket.js');
const discord = require('./discord.js');
const twitch = require('./twitch.js');

db.load_config().then(current_config => {
    socket.init(current_config, discord, version);
    discord.init(current_config, socket);
    twitch.init(current_config, socket);
})