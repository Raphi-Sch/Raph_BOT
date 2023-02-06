function list_audio(reload = false) {
    $.ajax({
        url: "api/commands.php?list-audio",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            for (const neddle in data) {
                // Base TR
                const TR = document.createElement('tr');

                // TD Name
                const TD_NAME = document.createElement('td');
                TD_NAME.classList.add('col-xs-2');
                TD_NAME.innerText = data[neddle].name;
                TR.appendChild(TD_NAME);

                // TD Trigger
                const TD_TRIGGER = document.createElement('td');
                TD_TRIGGER.classList.add('col-xs-1');
                TD_TRIGGER.innerText = data[neddle].trigger_word;
                TR.appendChild(TD_TRIGGER);

                // TD Volume
                const TD_VOLUME = document.createElement('td');
                TD_VOLUME.classList.add('col-xs-1');
                TD_VOLUME.classList.add('text-center');
                TD_VOLUME.innerText = parseInt(data[neddle].volume * 100) + "%";
                TR.appendChild(TD_VOLUME);

                // TD Timeout
                const TD_TIMEOUT = document.createElement('td');
                TD_TIMEOUT.classList.add('col-xs-1');
                TD_TIMEOUT.classList.add('text-center');
                TD_TIMEOUT.innerText = timeout_to_string(data[neddle].timeout);
                TR.appendChild(TD_TIMEOUT);

                // TD Active
                const TD_ACTIVE = document.createElement('td');
                const INPUT_ACTIVE = document.createElement('input');

                TD_ACTIVE.classList.add('col-xs-1');
                TD_ACTIVE.classList.add('text-center');
                INPUT_ACTIVE.type = 'checkbox';
                INPUT_ACTIVE.disabled = 'disabled';
                INPUT_ACTIVE.checked = data[neddle].active ? "checked" : "";

                TD_ACTIVE.appendChild(INPUT_ACTIVE);
                TR.appendChild(TD_ACTIVE);

                // TD Mod
                const TD_MOD = document.createElement('td');
                const INPUT_MOD = document.createElement('input');

                TD_MOD.classList.add('col-xs-1');
                TD_MOD.classList.add('text-center');
                INPUT_MOD.type = 'checkbox';
                INPUT_MOD.disabled = 'disabled';
                INPUT_MOD.checked = data[neddle].mod_only ? "checked" : "";

                TD_MOD.appendChild(INPUT_MOD);
                TR.appendChild(TD_MOD);

                // TD Sub
                const TD_SUB = document.createElement('td');
                const INPUT_SUB = document.createElement('input');

                TD_SUB.classList.add('col-xs-1');
                TD_SUB.classList.add('text-center');
                INPUT_SUB.type = 'checkbox';
                INPUT_SUB.disabled = 'disabled';
                INPUT_SUB.checked = data[neddle].sub_only ? "checked" : "";

                TD_SUB.appendChild(INPUT_SUB);
                TR.appendChild(TD_SUB);

                // TD Player
                const TD_PLAYER = document.createElement('td');
                const PLAYER = document.createElement('audio');

                TD_PLAYER.classList.add('col-xs-2');
                PLAYER.src = "src/audio/" + data[neddle].file;
                PLAYER.volume = parseFloat(data[neddle].volume);
                PLAYER.preload = "none";
                PLAYER.controls = "enable";

                TD_PLAYER.appendChild(PLAYER);
                TR.appendChild(TD_PLAYER);

                // TD BTN
                const TD_BTN = document.createElement('td');
                const SPAN_BTN = document.createElement('span');
                const BTN_DELETE = document.createElement('button');
                const ICO_DELETE = document.createElement('i');
                const BTN_EDIT = document.createElement('button');
                const ICO_EDIT = document.createElement('i');

                SPAN_BTN.className = "pull-right";
                BTN_EDIT.className = "btn btn-warning";
                BTN_EDIT.type = "button";
                BTN_EDIT.onclick = function () { edit_audio(data[neddle].id, data[neddle].name, data[neddle].trigger_word, data[neddle].volume, data[neddle].timeout, data[neddle].active, data[neddle].mod_only, data[neddle].sub_only) }
                ICO_EDIT.className = "glyphicon glyphicon-pencil";
                BTN_EDIT.appendChild(ICO_EDIT);
                SPAN_BTN.appendChild(BTN_EDIT);

                SPAN_BTN.appendChild(document.createTextNode(" "));

                BTN_DELETE.className = "btn btn-danger";
                BTN_DELETE.type = "button";
                BTN_DELETE.onclick = function () { del_audio(data[neddle].id, data[neddle].name) }
                ICO_DELETE.className = "glyphicon glyphicon-remove";
                BTN_DELETE.appendChild(ICO_DELETE);
                SPAN_BTN.appendChild(BTN_DELETE);

                TD_BTN.appendChild(SPAN_BTN);
                TR.appendChild(TD_BTN);

                LIST.appendChild(TR);
            }

            if (reload)
                reload_success();

        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                icon: 'error'
            })
        }
    })
}

function add_audio() {
    Swal.fire({
        title: "Add audio command",
        html: "<form id='swal-form' method='post' enctype='multipart/form-data' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add-audio'>" +
            "<label>Name</label><input type='text' class='form-control' name='name' required><br/>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' required><br/>" +
            "<label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value=0.5)><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 value=0><br/>" +
            `<label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br />` +
            `<label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />` +
            "<label>File</label><input type='file' class='form-control' name='audio' accept='.mp3' required>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function del_audio(id, name) {
    Swal.fire({
        title: `Delete : '${name}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", {
                action: "del-audio",
                id: id
            }, function () {
                list_audio(true);
            });
        }
    })
}

function edit_audio(id, name, trigger, volume, timeout, active, mod_only, sub_only) {
    checkbox_active = active ? "checked" : "";
    checkbox_mod = mod_only ? "checked" : "";
    checkbox_sub = sub_only ? "checked" : "";

    Swal.fire({
        title: `Edit : '${name}'`,
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='edit-audio'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Name</label><input type='text' class='form-control' name='name' value="${name}" required><br/>` +
            `<label>Trigger</label><input type='text' class='form-control' name='trigger' value='${trigger}'  required><br/>` +
            `<label>Volume (<span id='swal-volume'>${parseInt(volume * 100)}</span>%)</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value='${volume}' oninput="document.getElementById('swal-volume').innerText = parseInt(this.value*100)"><br/>` +
            `<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 value='${timeout}')><br/>` +
            `<label>Active</label><input class='form-control' type='checkbox' name='active' ${checkbox_active}><br />` +
            `<label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${checkbox_mod}><br />` +
            `<label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${checkbox_sub}><br />` +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                list_audio(true);
            });
        }
    });
}