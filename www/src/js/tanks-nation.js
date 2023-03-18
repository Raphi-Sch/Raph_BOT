function list_nation(reload = false){
    $.ajax({
        url: "api/tanks.php?list-nation",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.alias, 'col-xs-6'));
                TR.appendChild(createTableData(element.nation, 'col-xs-5'));
                TR.appendChild(createDeleteButton(() => del_nation(element)));
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: (result, status, error) => errorAPI(result, status, error)
    }) 
}

function add_nation() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='add-nation'>
            <label>Alias</label><input type='text' class='form-control' name='alias' required><br/>
            <label>Nation</label><select class='form-control' name='value' required>
            <option selected disabled> - Select a nation - </option>
            <option>china</option>
            <option>czechoslovakia</option>
            <option>france</option>
            <option>germany</option>
            <option>italy</option>
            <option>japan</option>
            <option>poland</option>
            <option>sweden</option>
            <option>uk</option>
            <option>usa</option>
            <option>ussr</option></select>
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_tanks.php', FORM_DATA).done(function () {
                list_nation(true);
            });
        }
    });
}

function del_nation(element) {
    Swal.fire({
        title: `Delete '${element.alias}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_tanks.php", {
                action: "del-nation",
                alias: element.alias
            }, function () {
                list_nation(true);
            });
        }
    })
}