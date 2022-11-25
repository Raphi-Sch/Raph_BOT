const socket = require('./socket.js')
const twitch = require('./twitch.js')
const config = require('./config.js')
const commands = require("./command/commands")
const moderator = require("./moderator/moderator")
const reaction = require("./reaction/reaction")
const shout = require("./shout/shout")
const audio = require("./audio/audio")

const version = "v5.7.0";

config.load().then(() => {
    socket.init(version);

    commands.init()
    moderator.init()
    reaction.init()
    shout.init()
    audio.init()

    twitch.init();
})
