function listTTS(reload = false) {
    $.ajax({
        url: "api/commands.php?list-tts-config",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-tts-config');
            LIST.innerHTML = "";

            data.forEach(element => {
                let editFunction = null;
                let displayValue = element.value;

                switch (element.type) {
                    case 0:
                        editFunction = editText;
                        break;
                    case 1:
                        editFunction = editBool;
                        displayValue = element.value ? "Enabled" : "Disabled";
                        break;
                    case 2:
                        editFunction = editNumber;
                        break;
                }

                const TR = document.createElement('tr');

                TR.appendChild(createTableData(element.id, 'col-xs-2'));
                TR.appendChild(createTableData(displayValue, 'col-xs-5'));
                TR.appendChild(createButtonGroup(createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => editFunction(element))));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();

        },
        error: errorAPI
    })
}

function editText(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form'>" +
            "<input type='hidden' name='action' value='edit-tts-config'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            `<input class='form-control' type='text' name='value' value="${element.value}"></form>`,
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
                listTTS(true);
            });
        }
    })
}

function editBool(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form'>" +
            "<input type='hidden' name='action' value='edit-tts-config'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            "<select id='swal-select' name='value' class='form-control'>" +
            "<option value=0>Disable</option>" +
            "<option value=1>Enable</option>" +
            "</select></form>",
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => { document.getElementById('swal-select').value = element.value; }
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                listTTS(true);
            });
        }
    })
}

function editNumber(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form'>" +
            "<input type='hidden' name='action' value='edit-tts-config'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            `<input class='form-control' type='number' name='value' step=1 min=1 max=1000 value="${element.value}"></form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                listTTS(true);
            });
        }
    })
}