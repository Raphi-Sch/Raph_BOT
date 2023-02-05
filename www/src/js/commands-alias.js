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
                const TD_ALIAS = document.createElement('td');
                TD_ALIAS.classList.add('col-xs-5');
                TD_ALIAS.innerText = data[neddle].alias;
                TR.appendChild(TD_ALIAS);

                // TD Text
                const TD_COMMAND = document.createElement('td');
                TD_COMMAND.classList.add('col-xs-5');
                TD_COMMAND.innerText = data[neddle].command;
                TR.appendChild(TD_COMMAND);

                // TD Btn
                const TD_BTN = document.createElement('td');
                const SPAN_BTN = document.createElement('SPAN_BTN');
                const BTN_DELETE = document.createElement('button');
                const ICO_DELETE = document.createElement('i');

                SPAN_BTN.className = "pull-right";

                BTN_DELETE.className = "btn btn-danger";
                BTN_DELETE.type = "button";
                BTN_DELETE.onclick = function () { del_alias(data[neddle].alias, data[neddle].command) }
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
                type: 'error'
            })
        }
    })
}

function list_option_alias() {
    // List text
    $.ajax({
        url: "api/commands.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            for (const neddle in data) {
                const option = document.createElement('option');
                option.innerText = data[neddle].command + ' (text)';
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

    // List audio
    $.ajax({
        url: "api/commands.php?list-audio",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            for (const neddle in data) {
                const option = document.createElement('option');
                option.innerText = data[neddle].trigger_word + ' (audio)';
                option.value = data[neddle].trigger_word;
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
            "<label>Command</label><select id='swal-select' class='form-control' name='value' required>" +
            "<option disabled selected> - Select a command - </option>" +
            "<option value='tank'>tank (built-in)</option>" +
            "</select></form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            list_option_alias();
        }
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function del_alias(alias) {
    Swal.fire({
        title: `Delete : '${alias}' ?`,
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

