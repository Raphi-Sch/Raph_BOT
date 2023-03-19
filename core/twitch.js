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
let tmiClient = null;

function init() {
    // Initial Twitch config
    init_tmi();
    tmiClient.connect();
    twitchAPI.init(config.twitch_channel, config.twitch_display_name, config.twitch_client_id, config.twitch_token);

    // Events
    tmiClient.on('connected', async (address, port) => {
        socket.twitch_state(true);
        send(config["twitch_connection_message"]);
        socket.log("[TWITCH] Connected on : " + address)

        setInterval(async function () {
            commands.time_trigger().then(result => {
                if (result) {
                    send(result)
                }
            })
        }, 60000);
    });

    tmiClient.on('disconnected', function () {
        socket.twitch_state(false);
        socket.log("[TWITCH] Disconnected from IRC");
    });

    tmiClient.on('chat', async (channel, user, message, isSelf) => {
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
            switch (parseInt(moderator_result.mod_action)) {
                case 0:
                    twitchAPI.banUser(user['user-id'], moderator_result.reason);
                    break;
                case 1:
                    twitchAPI.timeoutUser(user['user-id'], moderator_result.reason, moderator_result.duration);
                    break;
            }
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
    tmiClient = new tmi.client(tmiConfig);
}

function send(msg) {
    tmiClient.say(config.twitch_channel, msg);
}

module.exports = { init }