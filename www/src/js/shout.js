function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_shout.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<input type='text' class='form-control' name='original' placeholder='Original' required><br/>" +
            "<input type='text' class='form-control' name='replacement' placeholder='Replacement' required><br/>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function edit_entry(id, original, replacement) {
    Swal.fire({
        title: 'Editing : "' + original + '"',
        type: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_shout.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            "<input class='form-control' type='text' name='replacement' value=\"" + replacement + "\">" +
            "</form>",
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

// SYNC
// ----
// ASYNC

function del_entry(id, original) {
    Swal.fire({
        title: "Delete '" + original + "' ?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_shout.php", {
                action: "del",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}