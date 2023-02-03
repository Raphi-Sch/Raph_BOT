const socket = require('./socket.js')
const twitch = require('./twitch.js')
const config = require('./config.js')
const commands = require("./command/commands")
const moderator = require("./moderator/moderator")
const reaction = require("./reaction/reaction")
const shout = require("./shout/shout")

const version = "v5.8.0";

config.load().then(() => {
    // UI
    socket.init(version);

    // Plugins
    commands.init()
    moderator.init()
    reaction.init()
    shout.init()

    // Main thread
    twitch.init();
})
