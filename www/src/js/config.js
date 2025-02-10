function list(reload = false) {
    $.ajax({
        url: "api/config.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                if (!element.hidden) {
                    let displayValue = element.value;

                    if (element.type == 1) {
                        displayValue = (element.value == '1' ? "Enabled" : "Disabled")
                    };

                    const TR = document.createElement('tr');
                    const btnHelp = createButton("btn btn-info", "glyphicon glyphicon-info-sign", () => showHelp(element));
                    const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => editConfig(element));

                    TR.appendChild(createTableData(element.id, 'col-xs-2'));
                    TR.appendChild(createTableData(displayValue, 'col-xs-4'));

                    if(element.help != null){
                        TR.appendChild(createButtonGroup(btnHelp, btnEdit));
                    }
                    else{
                        TR.appendChild(createButtonGroup(btnEdit));
                    }

                    LIST.appendChild(TR);
                }
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function editConfig(element) {
    let input = "";
    let didOpen = null;
    switch (element.type) {
        case 0:
            if (element.value.length <= 50)
                input = `<input class='form-control' type='text' name='value' value="${element.value}">`;
            else
                input = `<textarea class='form-control' type='text' name='value'>${element.value}</textarea>`;
            break;

        case 1:
            input = `<select id='swal-select' name='value' class='form-control'><option value=0>Disable</option><option value=1>Enable</option></select>`;
            didOpen = () => { document.getElementById('swal-select').value = element.value; }
            break;

        case 2:
            input = `<input class='form-control' type='number' name='value' step=1 min=1 max=1000 value="${element.value}">`;
            break;
    }

    Swal.fire({
        title: `Editing : ${element.id}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='id' value='${element.id}'>
            ${input}
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: didOpen
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = {
                'id': document.getElementById('swal-form').id.value,
                'value': document.getElementById('swal-form').value.value
            }

            $.ajax({
                url: "api/config.php?edit",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    list(true);
                },
                error: errorAPI
            })
        }
    })
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

function updateTwitchToken(hash) {
    let token = hash.substring(hash.search("access_token=") + 13, hash.search("&"));

    const FORM_DATA = {
        'id': 'twitch_token',
        'value': token
    }

    $.ajax({
        url: "api/config.php?edit",
        type: "PATCH",
        dataType: "json",
        data: JSON.stringify(FORM_DATA),
        success: function () {
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
        },
        error: errorAPI
    })
}
