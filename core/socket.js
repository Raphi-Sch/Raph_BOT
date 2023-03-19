const http = require('http')
const fs = require('fs')
const { config } = require('./config');
const stream_log = fs.createWriteStream(__dirname + "/lastest.log", { flags: 'a' });

// Basic HTTP server
const server = http.createServer();
const io = require('socket.io').listen(server);

// Variables
let webClient = null;
let webClientConnected = false;

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
    server.listen(config.socket_port);

    // GUI Value
    GUI.shout.max = config.shout_interval;
    GUI.triggerTime.max = config.cmd_time_interval;
    GUI.triggerMessage.max = config.cmd_msg_interval;
}

// When webClient is connected, update all info
io.sockets.on('connection', function (socket) {
    webClient = socket;
    webClientConnected = true;

    updateWebUI();

    socket.on('stop-core', function () {
        log("[CORE] Halted");
        process.exit(0);
    });

    socket.on('disconnect', function () {
        webClientConnected = false;
    });

});

function updateWebUI() {
    if (webClientConnected)
        webClient.emit('update', JSON.stringify(GUI));
}

function setTwitchState(state) {
    GUI.twitch = state;
    updateWebUI();
}

function setShout(current, max) {
    GUI.shout = { current, max };
    updateWebUI();
}

function setTimeCounter(current, max, nb) {
    GUI.triggerTime = { current, max, nb };
    updateWebUI();
}

function setMessageCounter(current, max, nb) {
    GUI.triggerMessage = { current, max, nb };
    updateWebUI();
}

function log(msg) {
    // Format
    let date = new Date;
    let time = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) + "." + ('00' + date.getMilliseconds()).slice(-3);
    msg = "[" + time + "] " + msg + "\n";

    // Write to file
    stream_log.write(msg);

    // Update UI
    if (webClientConnected)
        webClient.emit('log', msg);
}

function playAudio(data) {
    if (webClientConnected) {
        webClient.emit('play-audio', JSON.stringify(data));
    }
}


module.exports = { init, setTwitchState, setShout, setTimeCounter, setMessageCounter, log, playAudio }