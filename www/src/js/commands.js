function list_commands() {
    $.ajax({
        url: "api/commands.php?list",
        type: "GET",
        success: function (result) {
            data = JSON.parse(result);

            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            for (const id in data) {
                if (id != 'count') {
                    // Base TR
                    const TR = document.createElement('tr');

                    // TD 1
                    const TD_1 = document.createElement('td');
                    TD_1.innerText = data[id]['command'];
                    TR.appendChild(TD_1);

                    // TD 2
                    const TD_2 = document.createElement('td');
                    TD_2.innerText = data[id]['value'];
                    TR.appendChild(TD_2);

                    // TD 3
                    const TD_3 = document.createElement('td');
                    const INPUT = document.createElement('input');

                    INPUT.type = 'checkbox';
                    INPUT.disabled = 'disabled';
                    INPUT.checked = data[id]['auto'] ? "checked" : "";

                    TD_3.appendChild(INPUT);
                    TR.appendChild(TD_3);

                    // TD 4
                    const TD_4 = document.createElement('td');
                    const SPAN = document.createElement('span');
                    const BTN_1 = document.createElement('button');
                    const BTN_2 = document.createElement('button');
                    const ICO_1 = document.createElement('i');
                    const ICO_2 = document.createElement('i');

                    SPAN.className = "pull-right";
                    
                    BTN_1.className = "btn btn-warning";
                    BTN_1.type = "button";
                    BTN_1.onclick = function() {edit_entry(id, data[id]['command'], data[id]['value'], data[id]['auto'])};
                    ICO_1.className = "glyphicon glyphicon-pencil";
                    BTN_1.appendChild(ICO_1);
                    SPAN.appendChild(BTN_1);

                    BTN_2.className = "btn btn-danger";
                    BTN_2.type = "button";
                    BTN_2.onclick = function() {del_entry(id, data[id]['command'])}
                    ICO_2.className = "glyphicon glyphicon-remove";
                    BTN_2.appendChild(ICO_2);
                    SPAN.appendChild(BTN_2);

                    TD_4.appendChild(SPAN);
                    TR.appendChild(TD_4);

                    LIST.appendChild(TR);
                }
            }
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

function add_entry() {
    Swal.fire({
        title: "Add command",
        html: "<form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Command</label><input type='text' class='form-control' name='command' placeholder='Command' required><br/>" +
            "<label>Text</label><input type='text' class='form-control' name='text' placeholder='Text' required><br/>" +
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
        title: 'Editing : "' + command + '"',
        type: 'info',
        html: "<br /><form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            `<label>Command</label><input class='form-control' type='text' name='command' value="${command}"><br />` +
            `<label>Text</label><input class='form-control' type='text' name='text' value="${text}"><br />` +
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
        title: "Delete '" + command + "' ?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", { action: "del", id: id }, function () {
                document.location.reload();
            });
        }
    })
}

// Tab alias
function add_alias() {
    Swal.fire({
        title: "Add command alias",
        html: "<form id='swal-form' method='post' action='src/php/POST_commands.php'>" +
            "<input type='hidden' name='action' value='add-alias'>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Command</label><select class='form-control' name='value' required><option disabled selected> - Select a command - </option>" +
            `${commands}` +
            "</select>" +
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
                document.location.reload();
            });
        }
    })
}