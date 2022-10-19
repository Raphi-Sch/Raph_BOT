// Module Import
const tmi = require("tmi.js");
const commands = require('./commands.js');
const reaction = require('./reaction.js');
const shout = require('./shout.js');
const audio = require('./audio.js');
const moderator = require('./moderator.js');

// Variable
let client;
let socket;
let config;

function init(config_init, socket_init) {
    config = config_init;
    socket = socket_init;

    // External lib
    commands.init(config, socket);
    reaction.init(config, socket);
    shout.init(config, socket);
    audio.init(config, socket);
    moderator.init(config, socket);

    // TMI config
    const tmiConfig = {
        option: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.bot_name,
            password: config.twitch_token
        },
        channels: [config.twitch_channel]
    };

    socket.log("[TWITCH] Connecting ...");
    client = new tmi.client(tmiConfig);
    client.connect();

    // Events
    client.on('connected', async (adress, port) => {
        socket.twitch_state(true);
        send(config["twitch_connection_message"]);
        socket.log("[TWITCH] Connected on : " + adress)

        setInterval(async function () {
            commands.time_trigger().then(result => send(result));
        }, 60000);
    });

    client.on('disconnected', function () {
        socket.twitch_state(false);
        socket.log("[TWITCH] Disconnected from IRC");
    });

    client.on('chat', async (channel, user, message, isSelf) => {
        // Do not react to himself
        if (isSelf) return;

        // Automatic command by number of messages
        const message_trigger_result = await commands.message_trigger();
        if (message_trigger_result) {
            send(message_trigger_result);
        }

        // Commands
        if (config.plugin_commands == 1) {
            const commands_result = await commands.run(user, message);
            if (commands_result) {
                send(commands_result);
                return;
            }
        }

        // Moderator
        if (config.plugin_moderator == 1) {
            const moderator_result = await moderator.run(user, message);
            if (moderator_result) {
                send(moderator_result.mod_action);
                send(moderator_result.explanation);
                return;
            }
        }

        // Reaction
        if (config.plugin_reaction == 1) {
            const reaction_result = await reaction.run(user, message);
            if (reaction_result) {
                send(reaction_result);
                return;
            }
        }

        // Shout
        if (config.plugin_shout == 1) {
            const shout_result = await shout.run(user, message);
            if (shout_result) {
                send(shout_result);
                return;
            }
        }

        // Audio
        if (config.plugin_audio == 1) {
            const audio_result = await audio.run(user, message);
            if (audio_result) {
                return; // Nothing to send
            }
        }

        // No respond
    });
}

function send(msg) {
    client.say(config["twitch_channel"], msg);
}

module.exports = { init }