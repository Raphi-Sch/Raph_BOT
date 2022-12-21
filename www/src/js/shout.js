function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_shout.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Original</label><input type='text' class='form-control' name='original' placeholder='Original' required><br/>" +
            "<label>Replacement</label><input type='text' class='form-control' name='replacement' placeholder='Replacement' required><br/>" +
            "<label>Language</label><select class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>" +
            "<label>Type</label><select class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>" +
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

function edit_entry(id, original, replacement, language, type) {
    Swal.fire({
        title: 'Editing : "' + original + '"',
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_shout.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            "<label>Replacement</label><input class='form-control' type='text' name='replacement' value=\"" + replacement + "\"><br/>" +
            "<label>Language</label><select id='swal-select-lang' class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>" +
            "<label>Type</label><select id='swal-select-type' class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>" +
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

    document.getElementById('swal-select-lang').value = language;
    document.getElementById('swal-select-type').value = type;
}

// SYNC
// ----
// ASYNC

function del_entry(id, original) {
    Swal.fire({
        title: "Delete '" + original + "' ?",
        icon: 'question',
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