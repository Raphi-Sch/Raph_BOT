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
            document.getElementById('btn-refresh').onclick = () => list_alias(true);

            window.history.pushState(null, '', 'commands.php?alias');
            list_alias();
            return;

        case 'commands':
            document.getElementById("tab-text").classList.add("active");
            document.getElementById('div-text').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => list_commands(true);

            window.history.pushState(null, '', 'commands.php?commands');
            list_commands();
            return;

        case 'audio':
            document.getElementById("tab-audio").classList.add("active");
            document.getElementById('div-audio').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => list_audio(true);

            window.history.pushState(null, '', 'commands.php?audio');
            list_audio();
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

function list_commands(reload = false) {
    $.ajax({
        url: "api/commands.php?list-text",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-text');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.command, 'col-xs-2'));
                TR.appendChild(createTableData(element.value, 'col-xs-4'));
                TR.appendChild(createCheckbox(element.auto));
                TR.appendChild(createCheckbox(element.mod_only));
                TR.appendChild(createCheckbox(element.sub_only));
                TR.appendChild(createCheckbox(element.tts));
                TR.appendChild(createButtonGroup(() => edit_entry(element), () => del_entry(element)));
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function add_entry() {
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
                list_commands(true);
            });
        }
    });
}

function edit_entry(data) {
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
                list_commands(true);
            });
        }
    })
}

function del_entry(data) {
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
                list_commands(true);
            });
        }
    })
}
