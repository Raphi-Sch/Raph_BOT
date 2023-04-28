function authEdit(data){
    element = JSON.parse(data);

    Swal.fire({
        title: `Editing : ${element.client}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='auth-edit'>
            <input type='hidden' name='id' value='${element.id}'>
            <label>Expiration date</label>
            <input type='date' class='form-control' name='expiration' value='${element.expiration}'>
            <br/>
            <label>Note</label>
            <input type='text' class='form-control' name='expiration' value='${element.note}'>
            <br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_authentication.php', FORM_DATA).done(function () {
                document.location.reload();
            });
        }
    })
}

function authDelete(data){
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
                id: element.id
            }, function () {
                document.location.reload();
            });
        }
    })
}

function authRenew(data){
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
            $.post("src/php/POST_authentication.php", {
                action: "auth-renew",
                id: element.id
            }, function () {
                document.location.reload();
            });
        }
    })
}