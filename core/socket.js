const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const { config } = require('./config');
const stream_log = fs.createWriteStream(__dirname + "/lastest.log", { flags: 'a' });

// Basic HTTP server
const server = http.createServer();
const io = require('socket.io').listen(server);
const room = crypto.randomBytes(16).toString("hex");

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

    if(config.debug == 1){
        log("[CORE] DEBUG IS ENABLE");
        log(`[SOCKET] Listening on ${config.socket_port}`);
        log(`[SOCKET] Room ID : ${room}`);
    }

    server.listen(config.socket_port);

    // GUI set max values
    GUI.shout.max = config.shout_interval;
    GUI.triggerTime.max = config.cmd_time_interval;
    GUI.triggerMessage.max = config.cmd_msg_interval;
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

function broadcast(){
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
    // Format
    let date = new Date;
    let time = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) + "." + ('00' + date.getMilliseconds()).slice(-3);
    msg = "[" + time + "] " + msg + "\n";

    // Write to file
    stream_log.write(msg);

    broadcast();
}

function playAudio(data) {
    io.to(room).emit('play-audio', JSON.stringify(data));
}

module.exports = { init, setTwitchState, setShout, setTimeCounter, setMessageCounter, log, playAudio }