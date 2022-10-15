// Module Import
const tmi = require("tmi.js");
const commands = require('./commands.js');
const reaction = require('./reaction.js');
const shout = require('./shout.js');
const audio = require('./audio.js');
const moderator = require('./moderator.js');

// Variable
var client = null;
var socket = null;
var config = null;

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
            username: config["bot_name"],
            password: config["twitch_token"]
        },
        channels: [config["twitch_channel"]]
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
            var result = await commands.time_trigger();
            if (result) {
                send(result);
            }
        }, 60000);
    });

    client.on('disconnected', function () {
        socket.twitch_state(false);
        socket.log("[TWITCH] Disconnected from IRC");
    });

    client.on('chat', async (channel, user, message, isSelf) => {
        var result = null;

        // Do not react to himself
        if (isSelf) return;

        // Automatic command by number of messages
        result = await commands.message_trigger();
        if (result) {
            send(result);
        }

        // Commands
        if (config['plugin_commands'] == 1) {
            result = await commands.run(user, message);
            if (result) {
                send(result);
                return;
            }
        }

        // Moderator
        if (config['plugin_moderator'] == 1) {
            result = await moderator.run(user, message);
            if (result) {
                send(result.mod_action);
                send(result.explanation);
                return;
            }
        }

        // Reaction
        if (config['plugin_reaction'] == 1) {
            result = await reaction.run(user, message);
            if (result) {
                send(result);
                return;
            }
        }

        // Shout
        if (config['plugin_shout'] == 1) {
            result = await shout.run(user, message);
            if (result) {
                send(result);
                return;
            }
        }

        // Audio
        if (config['plugin_audio'] == 1) {
            result = await audio.run(user, message);
            if (result) {
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