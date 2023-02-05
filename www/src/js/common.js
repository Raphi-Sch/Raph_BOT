function get_parameter(p) {
    var url = window.location.search.substring(1);
    var varUrl = url.split('&');
    for (var i = 0; i < varUrl.length; i++) {
        var parameter = varUrl[i].split('=');
        if (parameter[0] == p) {
            return parameter[1];
        }
    }
}

function get_parameter_name(pos) {
    var url = window.location.search.substring(1);
    var varUrl = url.split('&');
    for (var i = 0; i < varUrl.length; i++) {
        var parameter = varUrl[i].split('=');
        return parameter[pos];
    }
}

function is_get_param_set(p) {
    var url = window.location.search.substring(1);
    var varUrl = url.split('&');
    for (var i = 0; i < varUrl.length; i++) {
        var parameter = varUrl[i].split('=');
        if (parameter[0] == p) {
            return true;
        }
        return false;
    }
}

function reload_success() {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: 'Reload successful !'
    })
}

function timeout_to_string(seconds) {
    if(seconds >= 3600)
        return parseInt(seconds / 3600) + " hour";

    if(seconds >= 60)
        return parseInt(seconds / 60) + " min";

    if(seconds == 0)
        return "No timeout";

    return seconds + "s";
}

$(document).ready(function () {
    $.ajax({
        url: "api/config.php?name",
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (document.getElementById('bot_name')) {
                document.getElementById('bot_name').innerText = document.getElementById('bot_name').innerText + data.value;
            }
            if (document.getElementById('bot_name_nav')) {
                document.getElementById('bot_name_nav').innerText = data.value;
            }
        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                icon: 'error'
            })
        }
    })
});