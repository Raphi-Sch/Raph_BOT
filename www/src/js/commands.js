function view(param) {
    document.getElementById("tab-text").classList.remove("active");
    document.getElementById("tab-alias").classList.remove("active");
    document.getElementById("tab-audio").classList.remove("active");
    document.getElementById("tab-tts").classList.remove("active");

    document.getElementById('div-text').classList.add("hidden");
    document.getElementById('div-alias').classList.add("hidden");
    document.getElementById('div-audio').classList.add("hidden");
    document.getElementById('div-tts').classList.add("hidden");


    switch (param) {
        case 'alias':
            document.getElementById("tab-alias").classList.add("active");
            document.getElementById('div-alias').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => aliasList(true);

            window.history.pushState(null, '', 'commands.php?alias');
            aliasList();
            return;

        case 'commands':
            document.getElementById("tab-text").classList.add("active");
            document.getElementById('div-text').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => commandList(true);

            window.history.pushState(null, '', 'commands.php?commands');
            commandList();
            return;

        case 'audio':
            document.getElementById("tab-audio").classList.add("active");
            document.getElementById('div-audio').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => audioList(true);

            window.history.pushState(null, '', 'commands.php?audio');
            audioList();
            return;

        case 'tts':
            document.getElementById("tab-tts").classList.add("active");
            document.getElementById('div-tts').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => listTTS(true);

            window.history.pushState(null, '', 'commands.php?tts');
            listTTS();
            break;
    }
}

function commandList(reload = false) {
    $.ajax({
        url: "api/commands.php?list-text",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-text');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => commandEdit(element));
                const btnDel = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => commandDelete(element));

                TR.appendChild(createTableData(element.command, 'col-xs-2'));
                TR.appendChild(createTableData(element.value, 'col-xs-4'));
                TR.appendChild(createCheckbox(element.auto));
                TR.appendChild(createCheckbox(element.mod_only));
                TR.appendChild(createCheckbox(element.sub_only));
                TR.appendChild(createCheckbox(element.tts));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function commandAdd() {
    Swal.fire({
        title: "Add command",
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='add'>
            <label>Command</label><input type='text' class='form-control' name='command' placeholder='Command' required><br/>
            <label>Text</label><textarea type='text' class='form-control' name='text' placeholder='Text' required></textarea><br/>
            <label>Auto</label><input class='form-control' type='checkbox' name='auto'><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br /> 
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />
            <label>TTS</label><input class='form-control' type='checkbox' name='tts'><br />
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                commandList(true);
            });
        }
    });
}

function commandEdit(data) {
    checkbox_auto = data.auto ? "checked" : "";
    checkbox_mod = data.mod_only ? "checked" : "";
    checkbox_sub = data.sub_only ? "checked" : "";
    checkbox_tts = data.tts ? "checked" : "";

    Swal.fire({
        title: `Editing : "${data.command}"`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='edit'>
            <input type='hidden' name='id' value='${data.id}'>
            <label>Command</label><input class='form-control' type='text' name='command' value="${data.command}"><br />
            <label>Text</label><textarea class='form-control' type='text' name='text'>${data.value}</textarea><br />
            <label>Auto</label><input class='form-control' type='checkbox' name='auto' ${checkbox_auto}><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${checkbox_mod}><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${checkbox_sub}><br />
            <label>TTS</label><input class='form-control' type='checkbox' name='tts' ${checkbox_tts}><br />
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                commandList(true);
            });
        }
    })
}

function commandDelete(data) {
    Swal.fire({
        title: `Delete "${data.command}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", { action: "del", id: data.id }, function () {
                commandList(true);
            });
        }
    })
}

function aliasList(reload = false) {
    $.ajax({
        url: "api/commands.php?list-alias",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-alias');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');

                TR.appendChild(createTableData(element.alias, 'col-xs-5'));
                TR.appendChild(createTableData(element.command, 'col-xs-5'));
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => aliasDelete(element))));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function aliasListOption() {
    // List text
    $.ajax({
        url: "api/commands.php?list-text",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            data.forEach(element => {
                select.appendChild(createOption(element.command + ' (text)', element.command));
            })
        },
        error: errorAPI
    })

    // List audio
    $.ajax({
        url: "api/commands.php?list-audio",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            data.forEach(element => {
                select.appendChild(createOption(element.trigger_word + ' (audio)', element.trigger_word));
            })
        },
        error: errorAPI
    })
}

function aliasAdd() {
    Swal.fire({
        title: "Add command alias",
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='add-alias'/>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Command</label><select id='swal-select' class='form-control' name='value' required>" +
            "<option disabled selected> - Select a command - </option>" +
            "<option value='audio'>audio (built-in)</option>" +
            "<option value='tank'>tank (built-in)</option>" +
            "<option value='tts'>Text to speech (built-in)</option>" +
            "</select></form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            aliasListOption();
        }
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                aliasList(true);
            });
        }
    });
}

function aliasDelete(data) {
    Swal.fire({
        title: `Delete : '${data.alias}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", {
                action: "del-alias",
                id: data.id
            }, function () {
                aliasList(true);
            });
        }
    })
}

function audioList(reload = false) {
    $.ajax({
        url: "api/commands.php?list-audio",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-audio');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => audioEdit(element));
                const btnDel = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => audioDelete(element));

                TR.appendChild(createTableData(element.name, 'col-xs-2'));
                TR.appendChild(createTableData(element.trigger_word, 'col-xs-1'));
                TR.appendChild(createTableData(parseInt(element.volume * 100) + '%', 'col-xs-1 text-center'));
                TR.appendChild(createTableData(timeoutToString(element.timeout), 'col-xs-1 text-center'));
                TR.appendChild(createCheckbox(element.active));
                TR.appendChild(createCheckbox(element.mod_only));
                TR.appendChild(createCheckbox(element.sub_only));
                TR.appendChild(createPlayer(element));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();

        },
        error: errorAPI
    })
}

function audioAdd() {
    Swal.fire({
        title: "Add audio command",
        html: `<form id='swal-form' method='post' enctype='multipart/form-data' action='src/php/POST_commands.php'>
            <input type='hidden' name='action' value='add-audio'>
            <label>Name</label><input type='text' class='form-control' name='name' required><br/>
            <label>Trigger</label><input type='text' class='form-control' name='trigger' required><br/>
            <label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value=0.5)><br/>
            <label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 value=0><br/>
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />
            <label>File</label><input type='file' class='form-control' name='audio' accept='.mp3' required>
            </form>`,
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

function audioEdit(data) {
    Swal.fire({
        title: `Edit : '${data.name}'`,
        html: `<form id='swal-form'>
            <label>Name</label><input type='text' class='form-control' name='name' value="${data.name}" required><br/>
            <label>Trigger</label><input type='text' class='form-control' name='trigger' value='${data.trigger_word}'  required><br/>
            <label>Volume (<span id='swal-volume'>${parseInt(data.volume * 100)}</span>%)</label>
            <input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value='${data.volume}' oninput="document.getElementById('swal-volume').innerText = parseInt(this.value*100)"><br/>
            <label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 value='${data.timeout}')><br/>
            <label>Active</label><input class='form-control' type='checkbox' name='active' ${data.active ? "checked" : ""}><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${data.mod_only ? "checked" : ""}><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${data.sub_only ? "checked" : ""}><br />
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'id': data.id,
                'name': FORM.name.value,
                'trigger': FORM.trigger.value,
                'volume': FORM.volume.value,
                'timeout': FORM.timeout.value,
                'active': FORM.active.checked,
                'mod_only': FORM.mod_only.checked,
                'sub_only': FORM.sub_only.checked,
            };

            $.ajax({
                url: "api/commands.php?audio",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    audioList(true);
                },
                error: errorAPI
            })
        }
    });
}

function audioDelete(data) {
    Swal.fire({
        title: `Delete : '${data.name}' ?`,
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
                id: data.id
            }, function () {
                audioList(true);
            });
        }
    })
}

function listTTS(reload = false) {
    $.ajax({
        url: "api/commands.php?list-tts-config",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-tts-config');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');

                if (element.type == 1)
                    displayValue = (element.value == '1' ? "Enabled" : "Disabled");
                else
                    displayValue = element.value;

                TR.appendChild(createTableData(element.id, 'col-xs-2'));
                TR.appendChild(createTableData(displayValue, 'col-xs-5'));
                TR.appendChild(createButtonGroup(createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => editTTS(element))));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();

        },
        error: errorAPI
    })
}

function editTTS(element) {
    let input = "";
    let didOpen = null;
    switch (element.type) {
        case 0:
            input = `<input class='form-control' type='text' name='value' value="${element.value}">`;
            break;

        case 1:
            input = `<select id='swal-select' name='value' class='form-control'><option value=0>Disable</option><option value=1>Enable</option></select>`;
            didOpen = () => { document.getElementById('swal-select').value = element.value; }
            break;

        case 2:
            input = `<input class='form-control' type='number' name='value' step=1 min=1 max=1000 value="${element.value}">`;
            break;
    }

    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='edit-tts-config'>
            <input type='hidden' name='id' value='${element.id}'>
            ${input}
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: didOpen
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                listTTS(true);
            });
        }
    })
}