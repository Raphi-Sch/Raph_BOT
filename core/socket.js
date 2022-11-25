const http = require('http')
const fs = require('fs')
const config = require("./config").config

const stream_log = fs.createWriteStream(__dirname + "/lastest.log", { flags: 'a' });

const port = require('../config.json').socket_port;
// Basic HTTP server
const server = http.createServer();

const io = require('socket.io').listen(server);
// Variables
let web_client = null;
let web_client_connected = false;


// GUI info
const GUI = {
    twitch: false,
    shout: {
        current: 0,
        max: config.shout_interval
    },
    trigger_time: {
        current: 0,
        max: config.cmd_time_interval,
        nb: 0
    },
    trigger_msg: {
        current: 0,
        max: config.cmd_msg_interval,
        nb: 0
    },
};

function init(version) {
    log("[CORE] Started (" + version + ")");
    server.listen(port);
}

// When web_client is connected, update all info
io.sockets.on('connection', function (socket) {
    web_client = socket;
    web_client_connected = true;

    GUI_update();

    socket.on('stop-core', function () {
        log("[CORE] Halted");
        process.exit(0);
    });

    socket.on('disconnect', function () {
        web_client_connected = false;
    });

});

function GUI_update() {
    if (web_client_connected)
        web_client.emit('update', JSON.stringify(GUI));
}

function twitch_state(state) {
    GUI.twitch = state;
    GUI_update();
}

function shout_update(current, max) {
    GUI.shout = { current, max };
    GUI_update();
}

function time_trigger_update(current, max, nb) {
    GUI.trigger_time = { current, max, nb };
    GUI_update();
}

function msg_trigger_update(current, max, nb) {
    GUI.trigger_msg = { current, max, nb };
    GUI_update();
}

function log(msg) {
    // Format
    let date = new Date;
    let time = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) + "." + ('00' + date.getMilliseconds()).slice(-3);
    msg = "[" + time + "] " + msg + "\n";

    // Write to file
    stream_log.write(msg);

    // Update UI
    if (web_client_connected)
        web_client.emit('log', msg);
}

function play_audio(data) {
    if (web_client_connected) {
        web_client.emit('play-audio', JSON.stringify(data));
    }
}


module.exports = { init, twitch_state, shout_update, time_trigger_update, msg_trigger_update, log, play_audio }