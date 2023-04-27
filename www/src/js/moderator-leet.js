function listLeet(reload = false) {
    $.ajax({
        url: "api/moderator.php?list-leet",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-leet');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');

                TR.appendChild(createTableData(element.replacement, 'col-xs-5'));
                TR.appendChild(createTableData(element.original, 'col-xs-5'));
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => delLeet(element))));
                
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function addLeet(){
    Swal.fire({
        title: "Add leet conversion",
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='leet-add'/>" +
            "<label>Original</label><input type='text' class='form-control' name='original'><br/>" +
            "<label>Replacement</label><input type='text' class='form-control' name='replacement'>" +
            "</form>",
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_moderator.php', FORM_DATA).done(function () {
                listLeet(true);
            });
        }
    });
}

function delLeet(data){
    Swal.fire({
        title: `Delete "${data.original}" -> "${data.replacement}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_moderator.php", {
                action: "leet-del",
                id: data.id
            }, function () {
                listLeet(true);
            });
        }
    })
}