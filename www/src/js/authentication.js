function authAdd() {
    Swal.fire({
        title: "Add client",
        icon: 'question',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='auth-add'>
            <label>Usage</label>
            <select id='swal-usage' class='form-control' name='usage'>
                <option value=0>Core</option>
                <option value=1>WebUI</option>
                <option value=2>Other</option>
            </select>
            </form>`,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_authentication.php', FORM_DATA).done(function () {
                document.location.reload();
            });
        }
    });
}

function authEdit(data) {
    element = JSON.parse(data);

    Swal.fire({
        title: `Editing : ${element.client}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='auth-edit'>
            <input type='hidden' name='id' value='${element.id}'>
            <input type='hidden' name='client' value='${element.client}'>
            <label>Usage</label>
            <select id='swal-usage' class='form-control' name='usage'>
                <option value=0>Core</option>
                <option value=1>WebUI</option>
                <option value=2>Other</option>
            </select>
            <br/>
            <label>Expiration date</label>
            <input type='date' class='form-control' name='expiration' value='${element.expiration}'>
            <br/>
            <label>Note</label>
            <input type='text' class='form-control' name='note' value='${(element.note === null) ? "" : element.note}'>
            <br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            document.getElementById('swal-usage').value = element.usage;
        }
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_authentication.php', FORM_DATA).done(function () {
                document.location.reload();
            });
        }
    })
}

function authDelete(data) {
    element = JSON.parse(data);

    Swal.fire({
        title: `Delete "${element.client}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_authentication.php", {
                action: "auth-del",
                id: element.id,
                client: element.client
            }, function () {
                document.location.reload();
            });
        }
    })
}

function authRenew(data) {
    element = JSON.parse(data);

    Swal.fire({
        title: `Renew token for "${element.client}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "src/php/POST_authentication.php",
                type: "POST",
                dataType: "json",
                data:{
                    action: 'auth-renew',
                    id: element.id,
                    client: element.client
                },
                success: function (data) {
                    if (data) {    
                        let title = "";
                        let html = "";
    
                        if (data.file_updated) {
                            title = `Token renewed (config file updated)`;
                        }
                        else {
                            title = `Token renewed (copied to clipboard)`;
                            html = `<p id='swal-token'>${data.token}</p>`;
                        }
    
                        Swal.fire({
                            title: title,
                            icon: 'info',
                            width: '25%',
                            html: html,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            allowEnterKey: false,
                            didOpen: () => {
                                if (!data.file_updated)
                                    navigator.clipboard.writeText(document.getElementById('swal-token').innerText);
                            }
                        }).then(() => {
                            document.location.reload();
                        })
                    }
                },
                error: errorAPI
            })
        }
    })
}