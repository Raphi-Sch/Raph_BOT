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
                const TD_1 = document.createElement('td');
                TD_1.classList.add('col-xs-2');
                TD_1.innerText = data[neddle].command;
                TR.appendChild(TD_1);

                // TD 2 (Text)
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-8');
                TD_2.innerText = data[neddle].value;
                TR.appendChild(TD_2);

                // TD 3 (Auto)
                const TD_3 = document.createElement('td');
                const INPUT = document.createElement('input');

                TD_3.classList.add('col-xs-1');
                INPUT.type = 'checkbox';
                INPUT.disabled = 'disabled';
                INPUT.checked = data[neddle].auto ? "checked" : "";

                TD_3.appendChild(INPUT);
                TR.appendChild(TD_3);

                // TD 4 (Btn)
                const TD_4 = document.createElement('td');
                const SPAN = document.createElement('span');
                const BTN_1 = document.createElement('button');
                const BTN_2 = document.createElement('button');
                const ICO_1 = document.createElement('i');
                const ICO_2 = document.createElement('i');

                TD_4.classList.add('col-xs-1');
                SPAN.className = "pull-right";

                BTN_1.className = "btn btn-warning";
                BTN_1.type = "button";
                BTN_1.onclick = function () { edit_entry(data[neddle].id, data[neddle].command, data[neddle].value, data[neddle].auto) };
                ICO_1.className = "glyphicon glyphicon-pencil";
                BTN_1.appendChild(ICO_1);
                SPAN.appendChild(BTN_1);
                SPAN.appendChild(document.createTextNode(" "));

                BTN_2.className = "btn btn-danger";
                BTN_2.type = "button";
                BTN_2.onclick = function () { del_entry(data[neddle].id, data[neddle].command) }
                ICO_2.className = "glyphicon glyphicon-remove";
                BTN_2.appendChild(ICO_2);
                SPAN.appendChild(BTN_2);

                TD_4.appendChild(SPAN);
                TR.appendChild(TD_4);

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
        if (result.value)
            document.getElementById('swal-form').submit();
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
        html: "<br /><form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
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
        if (result.value)
            document.getElementById('swal-form').submit();
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
                list_commands(); // Dynamic reload
            });
        }
    })
}

// Tab alias
function list_alias(reload = false) {
    $.ajax({
        url: "api/commands.php?list-alias",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            for (const neddle in data) {
                // Base TR
                const TR = document.createElement('tr');

                // TD Command
                const TD_1 = document.createElement('td');
                TD_1.classList.add('col-xs-5');
                TD_1.innerText = data[neddle].alias;
                TR.appendChild(TD_1);

                // TD Text
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-5');
                TD_2.innerText = data[neddle].command;
                TR.appendChild(TD_2);

                // TD Btn
                const TD_4 = document.createElement('td');
                const SPAN = document.createElement('span');
                const BTN_1 = document.createElement('button');
                const ICO_1 = document.createElement('i');

                SPAN.className = "pull-right";

                BTN_1.className = "btn btn-danger";
                BTN_1.type = "button";
                BTN_1.onclick = function () { del_alias(data[neddle].alias, data[neddle].command) }
                ICO_1.className = "glyphicon glyphicon-remove";
                BTN_1.appendChild(ICO_1);
                SPAN.appendChild(BTN_1);

                TD_4.appendChild(SPAN);
                TR.appendChild(TD_4);

                LIST.appendChild(TR);
            }

            if (reload)
                reload_success();
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

function list_option_commands() {
    $.ajax({
        url: "api/commands.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            for (const neddle in data) {
                const option = document.createElement('option');
                option.innerText = data[neddle].command;
                option.value = data[neddle].command;
                select.appendChild(option);
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
}

function add_alias() {
    Swal.fire({
        title: "Add command alias",
        html: "<form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add-alias'/>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Command</label><select id='swal-select' class='form-control' name='value' required><option disabled selected> - Select a command - </option></select>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            list_option_commands();
        }
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function del_alias(alias) {
    Swal.fire({
        title: `Delete '${alias}' ?`,
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
                alias: alias
            }, function () {
                list_alias(); // Dynamic reload
            });
        }
    })
}

// Audio
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
                const TD_1 = document.createElement('td');
                TD_1.classList.add('col-xs-2');
                TD_1.innerText = data[neddle].name;
                TR.appendChild(TD_1);

                // TD Trigger
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-2');
                TD_2.innerText = data[neddle].trigger_word;
                TR.appendChild(TD_2);

                // TD Trigger
                const TD_3 = document.createElement('td');
                TD_3.classList.add('col-xs-1');
                TD_3.innerText = data[neddle].volume;
                TR.appendChild(TD_3);

                // TD Trigger
                const TD_4 = document.createElement('td');
                TD_4.classList.add('col-xs-1');
                TD_4.innerText = data[neddle].timeout;
                TR.appendChild(TD_4);

                // TD Volume
                const TD_5 = document.createElement('td');
                const SPAN = document.createElement('span');
                const BTN_1 = document.createElement('button');
                const ICO_1 = document.createElement('i');
                const BTN_2 = document.createElement('button');
                const ICO_2 = document.createElement('i');

                SPAN.className = "pull-right";

                BTN_2.className = "btn btn-warning";
                BTN_2.type = "button";
                BTN_2.onclick = function () { edit_audio(data[neddle].id, data[neddle].name, data[neddle].trigger_word, data[neddle].volume, data[neddle].timeout) }
                ICO_2.className = "glyphicon glyphicon-pencil";
                BTN_2.appendChild(ICO_2);
                SPAN.appendChild(BTN_2);

                SPAN.appendChild(document.createTextNode(" "));

                BTN_1.className = "btn btn-danger";
                BTN_1.type = "button";
                BTN_1.onclick = function () { del_audio(data[neddle].id, data[neddle].name) }
                ICO_1.className = "glyphicon glyphicon-remove";
                BTN_1.appendChild(ICO_1);
                SPAN.appendChild(BTN_1);

                TD_5.appendChild(SPAN);
                TR.appendChild(TD_5);

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
        title: "Import audio file",
        html: "<form id='swal-form' method='post' enctype='multipart/form-data' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add-audio'>" +
            "<label>Name</label><input type='text' class='form-control' name='name' required><br/>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' required><br/>" +
            "<label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.01 value=0.5)><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 )><br/>" +
            "<label>File</label><input type='file' class='form-control' name='audio' accept='.mp3' required>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Import',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function del_audio(id, name) {
    Swal.fire({
        title: `Delete ${name} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", {
                action: "del-audio",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}

function edit_audio(id, name, trigger, volume, timeout) {
    Swal.fire({
        title: "Edit entry '" + name + "'",
        html: "<form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='edit-audio'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            "<label>Name</label><input type='text' class='form-control' name='name' value='" + name + "' required><br/>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' value='" + trigger + "'  required><br/>" +
            "<label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.01 value='" + volume + "')><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 value='" + timeout + "')><br/>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}