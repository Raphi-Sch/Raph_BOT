function edit_text(key, value) {
    Swal.fire({
        title: `Editing : ${key}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${key}'>` +
            `<input class='form-control' type='text' name='value' value="${value}"></form>`,
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

function edit_textarea(key, value) {
    Swal.fire({
        title: `Editing : ${key}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${key}'>` +
            `<textarea class='form-control' type='text' name='value'>${value}</textarea>
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

function edit_bool(key, value) {
    Swal.fire({
        title: `Editing : ${key}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${key}'>` +
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
        didOpen: () => { document.getElementById('swal-select').value = value; }
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    })
}

function edit_number(key, value) {
    Swal.fire({
        title: `Editing : ${key}`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${key}'>` +
            `<input class='form-control' type='number' name='value' step=1 min=1 max=1000 value="${value}"></form>`,
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

function show_help(id, text) {
    Swal.fire({
        title: `Information about '${id}'`,
        html: `<h4>${text}</h4>`,
        icon: 'info',
        width: "500px",
        showCancelButton: false,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: 'Ok',
    })
}