function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_alias_commands.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Command</label><select class='form-control' name='value' required><option disabled selected> - Select a command - </option>" +
            `${commands}` +
            "</select>" +
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

// SYNC
// ----
// ASYNC

function del_entry(alias) {
    Swal({
        title: `Delete '${alias}' ?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_alias_commands.php", {
                action: "del",
                alias: alias
            }, function () {
                document.location.reload();
            });
        }
    })
}