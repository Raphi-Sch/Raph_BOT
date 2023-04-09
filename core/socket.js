const http = require('http');
const fs = require('fs');
const { config } = require('./config');
const stream_log = fs.createWriteStream(__dirname + "/lastest.log", { flags: 'a' });
const tools = require("./tools");

// Basic HTTP server
const server = http.createServer();
const io = require('socket.io').listen(server);
const room = "dashboard";

// GUI info
const GUI = {
    twitch: false,
    shout: {
        current: 0,
        max: 0
    },
    triggerTime: {
        current: 0,
        max: 0,
        nb: 0
    },
    triggerMessage: {
        current: 0,
        max: 0,
        nb: 0
    },
};

function init(version) {
    log("[CORE] Started (" + version + ")");

    if (config.debug_level >= 1) {
        log(`[DEBUG] DEBUG IS ENABLE (LEVEL ${config.debug_level})`);
        console.error(`[SOCKET] Listening port ${config.socket_port}`);
    }

    server.listen(config.socket_port);

    // GUI set max values
    GUI.shout.max = config.shout_interval;
    GUI.triggerTime.max = config.cmd_time_interval;
    GUI.triggerMessage.max = config.cmd_msg_interval;

    // Force GUI update
    if (config.force_gui_update > 0) {
        log(`[GUI] Forced refresh enable (every ${config.force_gui_update} sec)`);
        setInterval(async function () {
            if (config.debug_level >= 1) {
                console.error(`${tools.logTime()} [GUI] Refreshed`);
            }
            broadcast();
        }, config.force_gui_update * 1000);
    }
}

// Events are broadcast in a room to allow multiple clients at once
io.on('connection', socket => {
    socket.join(room);
    socket.emit('reload-log');

    socket.on('stop-core', function () {
        log("[CORE] Halted");
        process.exit(0);
    });

});

function broadcast() {
    io.to(room).emit('update', JSON.stringify(GUI));
}

function setTwitchState(state) {
    GUI.twitch = state;
    broadcast();
}

function setShout(current, max) {
    GUI.shout = { current, max };
    broadcast();
}

function setTimeCounter(current, max, nb) {
    GUI.triggerTime = { current, max, nb };
    broadcast();
}

function setMessageCounter(current, max, nb) {
    GUI.triggerMessage = { current, max, nb };
    broadcast();
}

function log(msg) {
    msg = `${tools.logTime()} ${msg} \n`;

    // Write to file
    stream_log.write(msg);

    // Send log to UI
    io.to(room).emit('log', msg);
}

function playAudio(data) {
    io.to(room).emit('play-audio', JSON.stringify(data));
}

module.exports = { init, setTwitchState, setShout, setTimeCounter, setMessageCounter, log, playAudio }