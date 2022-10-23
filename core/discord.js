const {Client} = require('discord.js')

const socket = require('./socket')
const config = require('./config').config

const discord_client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
// Global var

function init(){
    socket.log("[DISCORD] Connecting ...");
    discord_client.login(config.discord_token);
}

discord_client.on('ready', () => {
    socket.log("[DISCORD] Connected");
	socket.discord_state(true);
});

discord_client.on('disconnect', () => {
    socket.log("[DISCORD] Disconnected");
	socket.discord_state(false);
});

function send(msg, channel){
	switch (channel){
		case "annonce":
			console.log(config.discord_channel_1)
			discord_client.guilds.cache.get(config.discord_channel_1).send(msg);
			socket.log("[DISCORD] Announcement send");
			break;
			
		case "bot-command":
			discord_client.channels.cache.get(config.discord_channel_2).send(msg);
			break;
			
		default:
			console.error("Function : 'send' - Module : 'discord.js' - channel : undefined");
			break;
	}
}

module.exports = {init, send}