const version = "v5.6.2";

const socket = require('./socket.js');
const discord = require('./discord.js');
const twitch = require('./twitch.js');
const config = require('./config.js');

const commands = require("./command/commands");
const moderator = require("./moderator/moderator");
const reaction = require("./reaction");
const shout = require("./shout");
const audio = require("./audio");

config.load().then(() => {
    socket.init(discord, version);
    // discord.init(); // FIXME - discord don't work anymore

    commands.init()
    moderator.init()
    reaction.init()
    shout.init()
    audio.init()

    twitch.init();
})
