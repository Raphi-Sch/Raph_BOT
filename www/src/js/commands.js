function view(param) {
    switch (param) {
        case 'alias':
            document.getElementById("tab-text").classList.remove("active");
            document.getElementById("tab-alias").classList.add("active");
            document.getElementById("tab-audio").classList.remove("active");

            document.getElementById('th-command').classList.add('hidden');
            document.getElementById('th-alias').classList.remove('hidden');
            document.getElementById('th-audio').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => list_alias(true);
            list_alias();
            return;

        case 'commands':
            document.getElementById("tab-text").classList.add("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-audio").classList.remove("active");

            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-command').classList.remove('hidden');
            document.getElementById('th-audio').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => list_commands(true);
            list_commands();
            return;

        case 'audio':
            document.getElementById("tab-text").classList.remove("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-audio").classList.add("active");

            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-command').classList.add('hidden');
            document.getElementById('th-audio').classList.remove('hidden');

            document.getElementById('btn-refresh').onclick = () => list_audio(true);
            list_audio();
            return;
    }
}

function list_commands(reload = false) {
    $.ajax({
        url: "api/commands.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.command, 'col-xs-2'));
                TR.appendChild(createTableData(element.value, 'col-xs-5'));
                TR.appendChild(createCheckbox(element.auto));
                TR.appendChild(createCheckbox(element.mod_only));
                TR.appendChild(createCheckbox(element.sub_only));
                TR.appendChild(createButtonGroup(() => edit_entry(element), () => del_entry(element)));
                LIST.appendChild(TR);
            })

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

function add_entry() {
    Swal.fire({
        title: "Add command",
        html: `<form id='swal-form' method='post' action='src/php/POST_commands.php'>
            <input type='hidden' name='action' value='add'>
            <label>Command</label><input type='text' class='form-control' name='command' placeholder='Command' required><br/>
            <label>Text</label><textarea type='text' class='form-control' name='text' placeholder='Text' required></textarea><br/>
            <label>Auto</label><input class='form-control' type='checkbox' name='auto'><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br /> 
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />
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

    Swal.fire({
        title: `Editing : "${data.command}"`,
        icon: 'info',
        html: `<form id='swal-form' method='post'>
            <input type='hidden' name='action' value='edit'>
            <input type='hidden' name='id' value='${data.id}'>
            <label>Command</label><input class='form-control' type='text' name='command' value="${data.command}"><br />
            <label>Text</label><textarea class='form-control' type='text' name='text'>${data.value}</textarea><br />
            <label>Auto</label><input class='form-control' type='checkbox' name='auto' ${checkbox_auto}><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${checkbox_mod}><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${checkbox_sub}><br />
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
                list_commands(true); // Dynamic reload
            });
        }
    })
}
