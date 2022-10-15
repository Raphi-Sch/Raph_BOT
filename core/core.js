const version = "v5.6.1";

const db = require('./db.js');
const socket = require('./socket.js');
const discord = require('./discord.js');
const twitch = require('./twitch.js');

var current_config;

load_config();

async function load_config(){
    // Load config
    current_config = await db.load_config();

    // Init
    socket.init(current_config, discord, version);
    discord.init(current_config, socket);
    twitch.init(current_config, socket);
}