function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Tank</label><select class='form-control' name='value' required><option disabled selected> - Select a tank - </option>" +
            `${tanks}` +
            "</select></form>",
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

function del_entry(alias) {
    Swal.fire({
        title: `Delete '${alias}' ?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("alias_tanks.php", {
                action: "del",
                alias: alias
            }, function () {
                document.location.reload();
            });
        }
    })
}