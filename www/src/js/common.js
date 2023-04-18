function getParameterName(pos) {
    var url = window.location.search.substring(1);
    var varUrl = url.split('&');
    for (var i = 0; i < varUrl.length; i++) {
        var parameter = varUrl[i].split('=');
        return parameter[pos];
    }
}

function reloadSuccess() {
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

function createButtonGroupEditDelete(editFunction, deleteFunction) {
    const TD = document.createElement('td');
    const SPAN = document.createElement('span');
    SPAN.className = "pull-right";
    SPAN.appendChild(createButton("btn btn-warning", "glyphicon glyphicon-pencil", editFunction));
    SPAN.appendChild(document.createTextNode(" "));
    SPAN.appendChild(createButton("btn btn-danger", "glyphicon glyphicon-remove", deleteFunction));
    TD.appendChild(SPAN);
    return TD;
}

function createDeleteButton(deleteFunction) {
    const TD = document.createElement('td');
    const SPAN = document.createElement('span');
    SPAN.className = "pull-right";
    SPAN.appendChild(createButton("btn btn-danger", "glyphicon glyphicon-remove", deleteFunction));
    TD.appendChild(SPAN);
    return TD;
}

function createOption(text, value){
    const OPTION = document.createElement('option');
    OPTION.innerText = text;
    OPTION.value = value;
    return OPTION;
}

function createPlayer(data){
    const TD_PLAYER = document.createElement('td');
    const PLAYER = document.createElement('audio');
    TD_PLAYER.classList.add('col-xs-2');
    PLAYER.src = "src/audio/" + data.file;
    PLAYER.volume = parseFloat(data.volume);
    PLAYER.preload = "none";
    PLAYER.controls = "enable";
    TD_PLAYER.appendChild(PLAYER);
    return TD_PLAYER;
}

function createConfigButtonGroup(helpFunction, editFunction) {
    const TD = document.createElement('td');
    const SPAN = document.createElement('span');
    SPAN.className = "pull-right";
    SPAN.appendChild(createButton("btn btn-info", "glyphicon glyphicon-info-sign", helpFunction));
    SPAN.appendChild(document.createTextNode(" "));
    SPAN.appendChild(createButton("btn btn-warning", "glyphicon glyphicon-pencil", editFunction));
    TD.appendChild(SPAN);
    return TD;
}

function errorAPI(result, status, error){
    Swal.fire({
        title: "API Error while loading",
        icon: 'error',
        text: error
    })
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
        error: (result, status, error) => errorAPI(result, status, error)
    })
});