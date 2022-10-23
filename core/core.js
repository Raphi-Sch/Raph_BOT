const socket = require('./socket.js')

const discord = require('./discord.js')
const twitch = require('./twitch.js')
const config = require('./config.js')
const commands = require("./command/commands")

const moderator = require("./moderator/moderator")
const reaction = require("./reaction/reaction")
const shout = require("./shout/shout")
const audio = require("./audio/audio")

const version = "v5.6.2";

config.load().then(() => {
    // discord.init(); // FIXME - discord don't work anymore

    socket.init(version);

    commands.init()
    moderator.init()
    reaction.init()
    shout.init()
    audio.init()

    twitch.init();
})
