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