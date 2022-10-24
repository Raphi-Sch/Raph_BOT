function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_moderator.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Trigger word</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>" +
            "<label>Mod action</label><input type='text' class='form-control' name='mod_action' placeholder='Moderator action' required><br/>" +
            "<label>Explanation</label><input type='text' class='form-control' name='explanation' placeholder='Explanation' required><br/>" +
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

function edit_entry(id, trigger, mod, exp) {
    Swal.fire({
        title: `Editing : "${trigger}"`,
        type: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_moderator.php'><br/>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Trigger</label><input class='form-control' type='text' name='trigger' value="${trigger}"><br/>` +
            `<label>Mod action</label><input class='form-control' type='text' name='mod_action' value="${mod}"><br/>` +
            `<label>Explanation</label><input class='form-control' type='text' name='explanation' value="${exp}"><br/>` +
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

function del_entry(id, trigger) {
    Swal.fire({
        title: `Delete "${trigger}" ?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_moderator.php", {
                action: "del",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}
