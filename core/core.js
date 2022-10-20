const version = "v5.6.2";

const socket = require('./socket.js');
const discord = require('./discord.js');
const twitch = require('./twitch.js');
const config = require('./config.js');

const commands = require("./commands");
const moderator = require("./moderator");
const reaction = require("./reaction");
const shout = require("./shout");
const audio = require("./audio");

config.load().then(() => {
    socket.init(discord, version);
    // discord.init(current_config, socket); // FIXME - discord don't work anymore

    commands.init()
    moderator.init()
    reaction.init()
    shout.init()
    audio.init()

    twitch.init();
})
