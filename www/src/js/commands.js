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

                // TD 1 (Command)
                const TD_COMMAND = document.createElement('td');
                TD_COMMAND.classList.add('col-xs-2');
                TD_COMMAND.innerText = data[neddle].command;
                TR.appendChild(TD_COMMAND);

                // TD 2 (Text)
                const TD_VALUE = document.createElement('td');
                TD_VALUE.classList.add('col-xs-7');
                TD_VALUE.innerText = data[neddle].value;
                TR.appendChild(TD_VALUE);

                // TD 3 (Auto)
                const TD_ACTIVE = document.createElement('td');
                const INPUT_ACTIVE = document.createElement('input');

                TD_ACTIVE.classList.add('col-xs-1');
                TD_ACTIVE.classList.add('text-center');
                INPUT_ACTIVE.type = 'checkbox';
                INPUT_ACTIVE.disabled = 'disabled';
                INPUT_ACTIVE.checked = data[neddle].auto ? "checked" : "";

                TD_ACTIVE.appendChild(INPUT_ACTIVE);
                TR.appendChild(TD_ACTIVE);

                // TD 4 (Btn)
                const TD_BTN = document.createElement('td');
                const SPAN_BTN = document.createElement('span');
                const BTN_EDIT = document.createElement('button');
                const BTN_DELETE = document.createElement('button');
                const ICO_EDIT = document.createElement('i');
                const ICO_DELETE = document.createElement('i');

                SPAN_BTN.className = "pull-right";
                BTN_EDIT.className = "btn btn-warning";
                BTN_EDIT.type = "button";
                BTN_EDIT.onclick = function () { edit_entry(data[neddle].id, data[neddle].command, data[neddle].value, data[neddle].auto) };
                ICO_EDIT.className = "glyphicon glyphicon-pencil";
                BTN_EDIT.appendChild(ICO_EDIT);
                SPAN_BTN.appendChild(BTN_EDIT);
                SPAN_BTN.appendChild(document.createTextNode(" "));

                BTN_DELETE.className = "btn btn-danger";
                BTN_DELETE.type = "button";
                BTN_DELETE.onclick = function () { del_entry(data[neddle].id, data[neddle].command) }
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
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value){
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                list_commands(true);
            });
        }
    });
}

function edit_entry(id, command, text, auto) {
    if (auto == 1)
        checkbox = "checked";
    else
        checkbox = "";

    Swal.fire({
        title: `Editing : "${command}"`,
        icon: 'info',
        html: "<br /><form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Command</label><input class='form-control' type='text' name='command' value="${command}"><br />` +
            `<label>Text</label><textarea class='form-control' type='text' name='text'>${text}</textarea><br />` +
            `<label>Auto</label><input class='form-control' type='checkbox' name='auto' ${checkbox}><br />` +
            "</form>",
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value){
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                list_commands(true);
            });
        }
    })
}

function del_entry(id, command) {
    Swal.fire({
        title: `Delete "${command}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", { action: "del", id: id }, function () {
                list_commands(true); // Dynamic reload
            });
        }
    })
}
