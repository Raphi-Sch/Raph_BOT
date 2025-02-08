function playAudio(file, volume) {
    const PLAYER = document.createElement('audio');
    document.getElementById('players').appendChild(PLAYER);
    PLAYER.src = `src/audio/${file}?cachebusting=${new Date().getTime()}`; // Time is needed so TTS file are reloaded no matter what. '?cachebusting' do nothing except tricking the browser.
    PLAYER.volume = parseFloat(volume);
    PLAYER.play();
    PLAYER.onended = function () { PLAYER.remove() };
}

function connectSocket() {
    $.ajax({
        url: "api/socket.php?config",
        type: "GET",
        dataType: "json",
        success: function (config) {
            socket = io(`${config['protocol']}://${window.location.hostname}:${config['port']}`);

            // Audio
            socket.on('play-audio', function (json) {
                data = JSON.parse(json);
                playAudio(data.file, data.volume);
            })

            // TTS
            socket.on('play-TTS', function () {
                playAudio('tts.mp3', 1);
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
