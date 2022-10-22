function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
            "<label>Nation</label><select class='form-control' name='value' required>"+
            "<option selected disabled> - Select a nation - </option>"+
            "<option>china</option>" +
            "<option>czechoslovakia</option>"+
            "<option>france</option>"+
            "<option>germany</option>" +
            "<option>italy</option>"+
            "<option>japan</option>"+
            "<option>poland</option>"+
            "<option>sweden</option>"+
            "<option>uk</option>"+
            "<option>usa</option>"+
            "<option>ussr</option></select>" +
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
            $.post("alias_nation.php", {
                action: "del",
                alias: alias
            }, function() {
                document.location.reload();
            });
        }
    })
}