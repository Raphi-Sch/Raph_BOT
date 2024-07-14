// Module Import
const tmi = require('tmi.js');
const twitchAPI = require('./twitch/API.js');
const commands = require('./command/commands.js');
const reaction = require('./reaction/reaction.js');
const shout = require('./shout/shout.js');
const moderator = require('./moderator/moderator.js');

const config = require('./config').config;
const socket = require('./socket');
const tools = require('./tools');

// Variable
let tmiClient = null;

function init() {
    // Initial Twitch config
    initTmi();
    tmiClient.connect();
    twitchAPI.init(config.twitch_channel, config.twitch_display_name, config.twitch_client_id, config.twitch_token);

    // Events
    tmiClient.on('connected', async (address, port) => {
        socket.setTwitchState(true);
        send(config.twitch_connection_message);
        socket.log("[TWITCH] Connected on : " + address)

        setInterval(async function () {
            commands.timeTrigger().then(result => {
                if (result) {
                    send(result)
                }
            })
        }, 60000);
    });

    tmiClient.on('disconnected', function () {
        socket.setTwitchState(false);
        socket.log("[TWITCH] Disconnected from IRC");
    });

    tmiClient.on('chat', async (channel, user, message, isSelf) => {
        if (config.debug_level >= 2) {
            tools.debugTwitchChat(channel, user, message, isSelf);
        }

        // Do not react to himself
        if (isSelf || user["display-name"] == config.twitch_display_name) return;

        const moderatorResult = await moderator.run(user, message, twitchAPI);
        if (moderatorResult !== null) {
            send(moderatorResult);
            return;
        }

        const messageTriggerResult = await commands.messageTrigger();
        if (messageTriggerResult !== null) {
            send(messageTriggerResult);
        }

        const commandResult = await commands.run(user, message)
        if (commandResult !== null) {
            send(commandResult);
            return;
        }

        const reactionResult = await reaction.run(user, message);
        if (reactionResult !== null) {
            send(reactionResult);
            return;
        }

        const shoutResult = await shout.run(user, message);
        if (shoutResult !== null) {
            send(shoutResult);
            return;
        }

    });
}

function initTmi() {
    const tmiConfig = {
        option: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.twitch_display_name,
            password: "oauth:" + config.twitch_token
        },
        channels: [config.twitch_channel]
    };

    socket.log("[TWITCH] Connecting ...");
    tmiClient = new tmi.client(tmiConfig);
}

function send(msg) {
    if (msg !== null && msg !== true){
        tmiClient.say(config.twitch_channel, msg);
    }
}

module.exports = { init }