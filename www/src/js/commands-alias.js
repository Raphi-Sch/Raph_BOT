function list_alias(reload = false) {
    $.ajax({
        url: "api/commands.php?list-alias",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.alias, 'col-xs-5'));
                TR.appendChild(createTableData(element.command, 'col-xs-5'));
                TR.appendChild(createButtonGroup(() => edit_entry(element), () => del_entry(element)));
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
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

            data.forEach(element => {
                const option = document.createElement('option');
                option.innerText = element.command + ' (text)';
                option.value = element.command;
                select.appendChild(option);
            })
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

            data.forEach(element => {
                const option = document.createElement('option');
                option.innerText = element.trigger_word + ' (audio)';
                option.value = element.trigger_word;
                select.appendChild(option);
            })
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
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='add-alias'/>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Command</label><select id='swal-select' class='form-control' name='value' required>" +
            "<option disabled selected> - Select a command - </option>" +
            "<option value='audio'>audio (built-in)</option>" +
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
        if (result.value){
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                list_alias(true);
            });
        }
    });
}

function del_alias(data) {
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
                alias: data.alias
            }, function () {
                list_alias(true);
            });
        }
    })
}

