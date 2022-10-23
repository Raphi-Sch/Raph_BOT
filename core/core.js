const version = "v5.6.2";

import socket from './socket.js'
import discord from './discord.js'
import twitch from './twitch.js'
import config from './config.js'

import commands from "./command/commands"
import moderator from "./moderator/moderator"
import reaction from "./reaction/reaction"
import shout from "./shout/shout"
import audio from "./audio/audio"

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
