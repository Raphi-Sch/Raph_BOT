// Module Import
const tmi = require('tmi.js');
const twitchAPI = require('./twitchAPI.js');
const commands = require('./command/commands.js');
const reaction = require('./reaction/reaction.js');
const shout = require('./shout/shout.js');
const moderator = require('./moderator/moderator.js');

const config = require('./config').config;
const socket = require('./socket');

// Variable
let client = null;
let broadcasterID = null;

function init() {
    // Twitch initial config
    init_tmi();
    client.connect();
    broadcasterID = twitchAPI.getBroadcasterId(config.twitch_channel, config.twitch_client_id, config.twitch_token);

    // Events
    client.on('connected', async (adress, port) => {
        socket.twitch_state(true);
        send(config["twitch_connection_message"]);
        socket.log("[TWITCH] Connected on : " + adress)

        setInterval(async function () {
            commands.time_trigger().then(result => {
                if (result) {
                    send(result)
                }
            })
        }, 60000);
    });

    client.on('disconnected', function () {
        socket.twitch_state(false);
        socket.log("[TWITCH] Disconnected from IRC");
    });

    client.on('chat', async (channel, user, message, isSelf) => {
        // Do not react to himself
        if (isSelf || user["display-name"] == config.twitch_display_name) return;

        const message_trigger_result = await commands.message_trigger();
        if (message_trigger_result) {
            send(message_trigger_result);
        }
        const commands_result = await commands.run(user, message)
        if (commands_result) {
            send(commands_result);
            return;
        }
        const moderator_result = await moderator.run(user, message);
        if (moderator_result) {
            send(moderator_result.explanation);
            twitchAPI.banUser(broadcasterID, config.twitch_client_id, config.twitch_token, user['user-id'], moderator_result.reason);
            return;
        }
        const reaction_result = await reaction.run(user, message);
        if (reaction_result) {
            send(reaction_result);
            return;
        }
        const shout_result = await shout.run(user, message);
        if (shout_result) {
            send(shout_result);
            return;
        }

    });
}

function init_tmi() {
    const tmiConfig = {
        option: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.bot_name,
            password: "oauth:" + config.twitch_token
        },
        channels: [config.twitch_channel]
    };

    socket.log("[TWITCH] Connecting ...");
    client = new tmi.client(tmiConfig);
}

function send(msg) {
    client.say(config.twitch_channel, msg);
}

module.exports = { init }