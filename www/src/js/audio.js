function add_entry() {
    Swal.fire({
        title: "Import audio file",
        html: "<form id='swal-form' method='post' enctype='multipart/form-data'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Name</label><input type='text' class='form-control' name='name' required><br/>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' required><br/>" +
            "<label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.01 value=0.5)><br/>" +
            "<label>Frequency</label><input type='number' class='form-control' name='freq' min=0 max=100 )><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 )><br/>" +
            "<label>File</label><input type='file' class='form-control' name='audio' accept='.mp3' required>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Import',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}

function del_entry(id, name) {
    Swal({
        title: `Delete ${name} ?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("audio.php", {
                action: "del",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}

function edit_entry(id, name, trigger, volume, freq, timeout) {
    Swal.fire({
        title: "Edit entry '" + name + "'",
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            "<label>Name</label><input type='text' class='form-control' name='name' value='" + name + "' required><br/>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' value='" + trigger + "'  required><br/>" +
            "<label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.01 value='" + volume + "')><br/>" +
            "<label>Frequency</label><input type='number' class='form-control' name='freq' min=0 max=100 value='" + freq + "')><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 value='" + timeout + "')><br/>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value)
            document.getElementById('swal-form').submit();
    });
}