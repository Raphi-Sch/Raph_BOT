const fs = require('fs');
const { config } = require('./config');
const stream_log = fs.createWriteStream(__dirname + "/lastest.log", { flags: 'w' });
const tools = require("./tools");
const { Server } = require("socket.io");
const room = "dashboard";
const basicServer = {
    server: null,
    options: null
}

switch (config.socketProtocol) {
    case "http":
        basicServer.server = require('http').createServer();
        basicServer.options = {
            cors: {
                origin: "*"
            }
        }
        break;

    case "https":
        basicServer.server = require('https').createServer({
            key: fs.readFileSync(config.httpsKey),
            cert: fs.readFileSync(config.httpsCertificate)
        });
        basicServer.options = {
            cors: {
                origin: "*"
            }
        }
        break;

    default:
        console.error(`Invalid socket protocol (Must be 'http' or 'https', Current is : '${config.socketProtocol}')`);
        process.exit(1);
}

// Basic HTTP server
const io = new Server(basicServer.server, basicServer.options);

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
        total: 0
    },
    triggerMessage: {
        current: 0,
        max: 0,
        total: 0
    },
};

function init(version) {
    log(`[CORE] Started (${version})`);

    if (config.debug_level >= 1) {
        log(`[DEBUG] DEBUG IS ENABLE (LEVEL ${config.debug_level})`);
        console.error(`${tools.logTime()} [SOCKET] Listening port '${config.socketPort}', protocol '${config.socketProtocol}'`);
    }

    io.listen(config.socketPort);

    // GUI set max values
    GUI.shout.max = config.shout_interval;
    GUI.triggerTime.max = config.cmd_time_interval;
    GUI.triggerMessage.max = config.cmd_msg_interval;

    // Force GUI update
    if (config.gui_force_update > 0) {
        log(`[GUI] Forced refresh enable (every ${config.gui_force_update} sec)`);
        setInterval(async function () {
            if (config.debug_level >= 1) {
                console.error(`${tools.logTime()} [GUI] Refreshed`);
            }
            broadcast();
        }, config.gui_force_update * 1000);
    }
}

// Events are broadcast in a room to allow multiple clients at once
io.on('connection', socket => {
    socket.join(room);
    socket.emit('reload-log');
    broadcast();

    socket.on('stop-core', function () {
        log("[CORE] Halted with WebUI");
        process.exit(0);
    });

    if (config.debug_level >= 1) {
        console.error(`${tools.logTime()} [SOCKET] New connection`);
    }
});

function broadcast() {
    io.to(room).emit('update', JSON.stringify(GUI));
}

function setTwitchState(state) {
    GUI.twitch = state;
    broadcast();

    if (config.debug_level >= 1) {
        console.error(`${tools.logTime()} [TWITCH] Update state : ${GUI.twitch}`);
    }
}

function setShout(current, max) {
    GUI.shout = { current, max };
    broadcast();

    if (config.debug_level >= 1) {
        console.error(`${tools.logTime()} [SHOUT] Update state : Current ${GUI.shout.current}, Max ${GUI.shout.max}`);
    }
}

function setTimeCounter(current, max, total) {
    GUI.triggerTime = { current, max, total };
    broadcast();

    if (config.debug_level >= 1) {
        console.error(`${tools.logTime()} [TRIGGER-TIME] Update state : Current ${GUI.triggerTime.current}, Max ${GUI.triggerTime.max}, Total ${GUI.triggerTime.total}`);
    }
}

function setMessageCounter(current, max, total) {
    GUI.triggerMessage = { current, max, total };
    broadcast();

    if (config.debug_level >= 1) {
        console.error(`${tools.logTime()} [TRIGGER-MSG] Update state : Current ${GUI.triggerMessage.current}, Max ${GUI.triggerMessage.max}, Total ${GUI.triggerMessage.total}`);
    }
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

function playTTS() {
    io.to(room).emit('play-TTS');
}

module.exports = { init, setTwitchState, setShout, setTimeCounter, setMessageCounter, log, playAudio, playTTS }