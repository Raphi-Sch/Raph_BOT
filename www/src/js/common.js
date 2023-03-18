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

function timeoutToString(seconds) {
    if (seconds >= 3600)
        return parseInt(seconds / 3600) + " hour";

    if (seconds >= 60)
        return parseInt(seconds / 60) + " min";

    if (seconds == 0)
        return "No timeout";

    return seconds + " s";
}

function createTableData(data, className) {
    const TD = document.createElement('td');
    TD.className = className;
    TD.innerText = data;
    return TD;
}

function createCheckbox(checked) {
    const TD = document.createElement('td');
    TD.classList.add('col-xs-1');
    TD.classList.add('text-center');

    const INPUT = document.createElement('input');
    INPUT.type = 'checkbox';
    INPUT.disabled = 'disabled';
    INPUT.checked = checked ? "checked" : "";

    TD.appendChild(INPUT);
    return TD;
}

function createButton(btnClass, icoClass, onclick) {
    const BTN = document.createElement('button');
    BTN.className = btnClass;
    BTN.type = "button";
    BTN.onclick = onclick;

    const ICO = document.createElement('i');
    ICO.className = icoClass;

    BTN.appendChild(ICO);
    return BTN;
}

function createButtonGroup(editFunction, deleteFunction) {
    const TD = document.createElement('td');
    const SPAN = document.createElement('span');
    SPAN.className = "pull-right";
    SPAN.appendChild(createButton("btn btn-warning", "glyphicon glyphicon-pencil", editFunction));
    SPAN.appendChild(document.createTextNode(" "));
    SPAN.appendChild(createButton("btn btn-danger", "glyphicon glyphicon-remove", deleteFunction));
    TD.appendChild(SPAN);
    return TD;
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