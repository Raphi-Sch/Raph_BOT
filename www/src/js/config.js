function edit_entry(key, value) {
    Swal({
        title: 'Editing : "' + key + '"',
        type: 'info',
        html: "<form id='swal-form' method='post'>" +
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