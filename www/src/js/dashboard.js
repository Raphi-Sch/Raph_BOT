let socket = null;
let core_state = false;
let is_tab_log = false;

function updateTwitchState(state) {
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

function updateShoutCounter(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('shout-bar').style.width = (data.current / data.max) * 100 + "%";
        document.getElementById('shout-text').innerHTML = data.current + " / " + data.max;
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-shout-text').innerHTML = data.current + " / " + data.max;
    }
}

function updateTriggerTime(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('auto-cmd-time-bar').style.width = (data.current / data.max) * 100 + "%";
        document.getElementById('auto-cmd-time-text').innerHTML = data.current + " / " + data.max;
        document.getElementById('auto-cmd-time-counter').innerHTML = data.total;
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-time-text').innerHTML = data.current + " / " + data.max;
    }
}

function updateTriggerMessage(data) {
    // Dashboard
    if (is_dashboard) {
        document.getElementById('auto-cmd-msg-bar').style.width = (data.current / data.max) * 100 + "%";
        document.getElementById('auto-cmd-msg-text').innerHTML = data.current + " / " + data.max;
        document.getElementById('auto-cmd-msg-counter').innerHTML = data.total;
    }

    // Dock
    if (is_dock) {
        document.getElementById('dock-msg-text').innerHTML = data.current + " / " + data.max;
    }
}

function startStop() {
    if (core_state) {
        swal.fire({
            title: 'Stop',
            text: "Are you sure you want to stop the bot ?",
            icon: 'warning',
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

function playAudio(file, volume) {
    if (is_dashboard) {
        const PLAYER = document.createElement('audio');
        document.getElementById('players').appendChild(PLAYER);
        PLAYER.src = `src/audio/${file}?cachebusting=${new Date().getTime()}`; // Time is needed so TTS file are reloaded no matter what. '?cachebusting' do nothing except tricking the browser.
        PLAYER.volume = parseFloat(volume);
        PLAYER.play();
        PLAYER.onended = function () { PLAYER.remove() };
    }
}

function connectSocket() {
    $.ajax({
        url: "api/config.php?socket-port",
        type: "GET",
        dataType: "json",
        success: function (data) {
            port = data['value'];

            socket = io('http://' + window.location.hostname + ':' + port);

            socket.on('connect', function () {
                // Dashboard
                if (is_dashboard) {
                    document.getElementById('core-statut').className = "progress-bar progress-bar-success";
                    document.getElementById('core-statut').innerHTML = "Connected";
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
                    document.getElementById("btn-start-stop").className = "btn btn-success";
                    document.getElementById("ico-start-stop").className = "glyphicon glyphicon-play";
                }

                // Dock
                if (is_dock) {
                    document.getElementById('dock-core-statut').className = "glyphicon glyphicon-off ico-red";
                    document.getElementById('dock-twitch-statut').className = "glyphicon glyphicon-hourglass ico-orange";
                }

                core_state = false;
            })

            // Update
            socket.on('update', function (json) {
                data = JSON.parse(json);

                updateTwitchState(data.twitch);
                updateShoutCounter(data.shout);
                updateTriggerTime(data.triggerTime);
                updateTriggerMessage(data.triggerMessage);
            })

            // Log
            socket.on('log', function (msg) {
                if((is_dashboard && is_tab_log) || is_dock){
                    log_element = document.getElementById("log");
                    log_element.innerText += msg;
                    log_element.scrollTop = log_element.scrollHeight;
                }
            })

            // Audio
            socket.on('play-audio', function (json) {
                data = JSON.parse(json);
                playAudio(data.file, data.volume);
            })

            // Reload log
            socket.on('reload-log', function (){
                getLog();
            });

            // TTS
            socket.on('play-TTS', function(){
                playAudio('tts.wav', 1);
            })

        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                type: 'error'
            })
        }
    })
}

function getLog() {
    if(is_dashboard){
        document.getElementById('tab-log').classList.add('active');
        document.getElementById('tab-debug').classList.remove('active');
        is_tab_log = true;
    }

    $.ajax({
        url: "api/config.php?log",
        type: "GET",
        success: function (result) {
            document.getElementById("log").innerText = "";
            document.getElementById("log").innerText = result;
        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                type: 'error'
            })
        }
    })
}

function getDebug() {
    if(is_dashboard){
        document.getElementById('tab-debug').classList.add('active');
        document.getElementById('tab-log').classList.remove('active');
        is_tab_log = false;
    }

    $.ajax({
        url: "api/config.php?debug",
        type: "GET",
        success: function (result) {
            document.getElementById("log").innerText = "";
            document.getElementById("log").innerText = result;
        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                type: 'error'
            })
        }
    })
}