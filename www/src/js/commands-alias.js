function list_alias(reload = false) {
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
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => del_audio(element))));
                
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function list_option_alias() {
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
            list_option_alias();
        }
    }).then((result) => {
        if (result.value) {
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
                id: data.id
            }, function () {
                list_alias(true);
            });
        }
    })
}

