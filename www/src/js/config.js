function list(reload = false){
    $.ajax({
        url: "api/config.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                let editFunction = null;

                switch (element.type) {
                    case 0:
                        if(element.value.length >= 50)
                            editFunction = editTextarea;
                        else
                            editFunction = editText;
                        break;
                    case 1:
                        editFunction = editBool;
                        break;
                    case 2:
                        editFunction = editNumber;
                        break;
                }

                const TR = document.createElement('tr');
                const btnHelp = createButton("btn btn-info", "glyphicon glyphicon-info-sign", () => showHelp(element));
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => editFunction(element));

                TR.appendChild(createTableData(element.id, 'col-xs-2'));
                TR.appendChild(createTableData((element.hidden ? '##########' : element.value), 'col-xs-4'));
                TR.appendChild(createButtonGroup(btnHelp, btnEdit));

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
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            `<input class='form-control' type='text' name='value' value="${element.value}"></form>`,
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

function editTextarea(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            `<textarea class='form-control' type='text' name='value'>${element.value}</textarea>
            </form>`,
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

function editBool(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
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
        if (result.value)
            document.getElementById('swal-form').submit();
    })
}

function editNumber(element) {
    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${element.id}'>` +
            `<input class='form-control' type='number' name='value' step=1 min=1 max=1000 value="${element.value}"></form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    })
}

function twitch_token(hash) {
    let token = hash.substring(hash.search("access_token=") + 13, hash.search("&"));

    $.post("src/php/POST_config.php", { action: "edit", id: "twitch_token", value: token }, function () {
        Swal.fire({
            title: `Twitch token updated !`,
            icon: 'info',
            showCancelButton: false,
            focusConfirm: false,
            allowOutsideClick: false,
            confirmButtonText: 'Ok',
        }).then((result) => {
            if (result.value)
                window.location = window.location.origin + window.location.pathname;
        })
    });
}

function showHelp(element) {
    Swal.fire({
        title: `Information about '${element.id}'`,
        html: `<h4>${element.help}</h4>`,
        icon: 'info',
        width: "500px",
        showCancelButton: false,
        focusConfirm: true,
        confirmButtonText: 'Ok',
    })
}