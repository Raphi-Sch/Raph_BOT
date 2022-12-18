function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_reactions.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' placeholder='Trigger' required><br/>" +
            "<label>Reaction</label><input type='text' class='form-control' name='reaction' placeholder='Reaction' required><br/>" +
            "<label>Frequency</label><input type='number' class='form-control' name='frequency' min=0 step=1 max=100 required><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 required><br/>" +
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

function edit_entry(id, trigger, text, freq, time) {
    Swal.fire({
        title: `Editing : "${trigger}"`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_reactions.php'><br/>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Trigger</label><input class='form-control' type='text' name='trigger' value="${trigger}"><br/>` +
            `<label>Reaction</label><input class='form-control' type='text' name='reaction' value="${text}"><br/>` +
            `<label>Frequency (%)</label><input class='form-control' type='number' name='frequency' min=0 step=1 max=100 value="${freq}"><br/>` +
            `<label>Timeout (s)</label><input class='form-control' type='number' name='timeout' min=0 step=1 value="${time}"><br/>` +
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
        title: "Delete '" + trigger + "' ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_reactions.php", {
                action: "del",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}