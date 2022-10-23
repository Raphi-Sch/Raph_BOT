let socket = null;
let core_state = false;

function twitch_state(state) {
    // Dashboard
    if (is_dashboard) {
        if (state) {
            document.getElementById('twitch-statut').className = "progress-bar progress-bar-success";
            document.getElementById('twitch-statut').innerHTML = "Connected";
        }
        else {
            document.getElementById('twitch-statut').className = "progress-bar progress-bar-danger";
            document.getElementById('twitch-statut').innerHTML = "Disconnected";
        }
    }

    // Dock
    if (is_dock) {
        if (state) {
            document.getElementById('dock-twitch-statut').className = "glyphicon glyphicon-ok ico-green";
        }
        else {
            document.getElementById('dock-twitch-statut').className = "glyphicon glyphicon-remove ico-red";
        }
    }
}

function discord_state(state) {
    // Dashboard
    if (is_dashboard) {
        if (state) {
            document.getElementById('discord-statut').className = "progress-bar progress-bar-success";
            document.getElementById('discord-statut').innerHTML = "Connected";
        }
        else {
            document.getElementById('discord-statut').className = "progress-bar progress-bar-danger";
            document.getElementById('discord-statut').innerHTML = "Disconnected";
        }
    }

    // Dock
    if (is_dock) {
        if (state) {
            document.getElementById('dock-discord-statut').className = "glyphicon glyphicon-ok ico-green";
        }
        else {
            document.getElementById('dock-discord-statut').className = "glyphicon glyphicon-remove ico-red";
        }
    }
}

function shout(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('shout-bar').style.width = (data['current'] / data['max']) * 100 + "%";
        document.getElementById('shout-text').innerHTML = data['current'] + " / " + data['max'];
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-shout-text').innerHTML = data['current'] + " / " + data['max'];
    }
}

function trigger_time(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('auto-cmd-time-bar').style.width = (data['current'] / data['max']) * 100 + "%";
        document.getElementById('auto-cmd-time-text').innerHTML = data['current'] + " / " + data['max'];
        document.getElementById('auto-cmd-time-counter').innerHTML = data['nb'];
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-time-text').innerHTML = data['current'] + " / " + data['max'];
    }
}

function trigger_msg(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('auto-cmd-msg-bar').style.width = (data['current'] / data['max']) * 100 + "%";
        document.getElementById('auto-cmd-msg-text').innerHTML = data['current'] + " / " + data['max'];
        document.getElementById('auto-cmd-msg-counter').innerHTML = data['nb'];
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-msg-text').innerHTML = data['current'] + " / " + data['max'];
    }
}

function annonce() {
    swal({
        title: 'Discord announcement',
        text: "Send announcement to discord ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Send'
    }).then((result) => {
        if (result.value) {
            socket.emit('discord-notification');
        }
    })
}

function start_stop() {
    if (core_state) {
        swal({
            title: 'Stop',
            text: "Are you sure you want to stop the bot ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                socket.emit('stop-core');
            }
        })
    }
    else {
        $.post("src/php/POST_core.php", { action: "start" }, function (data) { console.log(data) });
        document.getElementById("log").innerText = "";
        document.getElementById("btn-start-stop").disabled = true;
    }
}

function play_audio(file, volume) {
    if (is_dashboard) {
        document.getElementById('player').src = "src/audio/" + file;
        document.getElementById('player').volume = parseFloat(volume);
        document.getElementById('player').play();
    }
}

socket = io.connect('http://' + window.location.hostname + ':' + port);

socket.on('connect', function () {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('core-statut').className = "progress-bar progress-bar-success";
        document.getElementById('core-statut').innerHTML = "Connected";
        document.getElementById("btn-annonce").style.display = "inline-block";
        document.getElementById("btn-start-stop").className = "btn btn-danger";
        document.getElementById("ico-start-stop").className = "glyphicon glyphicon-stop";
        document.getElementById("btn-start-stop").disabled = false;
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-core-statut').className = "glyphicon glyphicon-ok ico-green";
    }

    // Toggle
    core_state = true;
})

socket.on('disconnect', function () {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('core-statut').className = "progress-bar progress-bar-danger";
        document.getElementById('core-statut').innerHTML = "Disconnected";
        document.getElementById('twitch-statut').className = "progress-bar progress-bar-warning";
        document.getElementById('twitch-statut').innerHTML = "Waiting for the core";
        document.getElementById('discord-statut').className = "progress-bar progress-bar-warning";
        document.getElementById('discord-statut').innerHTML = "Waiting for the core";
        document.getElementById("btn-annonce").style.display = "none";
        document.getElementById("btn-start-stop").className = "btn btn-success";
        document.getElementById("ico-start-stop").className = "glyphicon glyphicon-play";
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-core-statut').className = "glyphicon glyphicon-off ico-red";
        document.getElementById('dock-twitch-statut').className = "glyphicon glyphicon-hourglass ico-orange";
        document.getElementById('dock-discord-statut').className = "glyphicon glyphicon-hourglass ico-orange";
    }

    core_state = false;
})

// Update
socket.on('update', function (json) {
    data = JSON.parse(json);

    twitch_state(data['twitch']);
    discord_state(data['discord']);
    shout(data['shout']);
    trigger_time(data['trigger_time']);
    trigger_msg(data['trigger_msg']);
})

// Log
socket.on('log', function (msg) {
    log_element = document.getElementById("log");
    log_element.innerText += msg;
    log_element.scrollTop = log_element.scrollHeight;
})

// Audio
socket.on('play-audio', function (json) {
    data = JSON.parse(json);
    play_audio(data['file'], data['volume']);
})

