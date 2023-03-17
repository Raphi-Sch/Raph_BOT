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

            for (const neddle in data) {
                // Base TR
                const TR = document.createElement('tr');

                // TD Command
                const TD_COMMAND = document.createElement('td');
                TD_COMMAND.classList.add('col-xs-2');
                TD_COMMAND.innerText = data[neddle].command;
                TR.appendChild(TD_COMMAND);

                // TD Text
                const TD_VALUE = document.createElement('td');
                TD_VALUE.classList.add('col-xs-5');
                TD_VALUE.innerText = data[neddle].value;
                TR.appendChild(TD_VALUE);

                // TD Auto
                const TD_ACTIVE = document.createElement('td');
                const INPUT_ACTIVE = document.createElement('input');

                TD_ACTIVE.classList.add('col-xs-1');
                TD_ACTIVE.classList.add('text-center');
                INPUT_ACTIVE.type = 'checkbox';
                INPUT_ACTIVE.disabled = 'disabled';
                INPUT_ACTIVE.checked = data[neddle].auto ? "checked" : "";

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

                // TD Btn
                const TD_BTN = document.createElement('td');
                const SPAN_BTN = document.createElement('span');
                const BTN_EDIT = document.createElement('button');
                const BTN_DELETE = document.createElement('button');
                const ICO_EDIT = document.createElement('i');
                const ICO_DELETE = document.createElement('i');

                SPAN_BTN.className = "pull-right";
                BTN_EDIT.className = "btn btn-warning";
                BTN_EDIT.type = "button";
                BTN_EDIT.onclick = function () { edit_entry(data[neddle]) };
                ICO_EDIT.className = "glyphicon glyphicon-pencil";
                BTN_EDIT.appendChild(ICO_EDIT);
                SPAN_BTN.appendChild(BTN_EDIT);
                SPAN_BTN.appendChild(document.createTextNode(" "));

                BTN_DELETE.className = "btn btn-danger";
                BTN_DELETE.type = "button";
                BTN_DELETE.onclick = function () { del_entry(data[neddle]) }
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

function add_entry() {
    Swal.fire({
        title: "Add command",
        html: "<form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Command</label><input type='text' class='form-control' name='command' placeholder='Command' required><br/>" +
            "<label>Text</label><textarea type='text' class='form-control' name='text' placeholder='Text' required></textarea><br/>" +
            `<label>Auto</label><input class='form-control' type='checkbox' name='auto'><br />` +
            `<label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br />` +
            `<label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />` +
            "</form>",
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
        html: "<br /><form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${data.id}'>` +
            `<label>Command</label><input class='form-control' type='text' name='command' value="${data.command}"><br />` +
            `<label>Text</label><textarea class='form-control' type='text' name='text'>${data.value}</textarea><br />` +
            `<label>Auto</label><input class='form-control' type='checkbox' name='auto' ${checkbox_auto}><br />` +
            `<label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${checkbox_mod}><br />` +
            `<label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${checkbox_sub}><br />` +
            "</form>",
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
