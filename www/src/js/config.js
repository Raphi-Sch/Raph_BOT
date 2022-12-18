function edit_entry(key, value) {
    Swal.fire({
        title: 'Editing : "' + key + '"',
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_config.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + key + "'>" +
            "<input class='form-control' type='text' name='value' value=\"" + value + "\"></form>",
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