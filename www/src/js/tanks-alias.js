function list_alias(reload = false) {
    $.ajax({
        url: "api/tanks.php?list-alias",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.alias, 'col-xs-6'));
                TR.appendChild(createTableData(element.tank, 'col-xs-5'));
                TR.appendChild(createDeleteButton(() => del_alias(element)));
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                icon: 'error'
            })
        }
    }) 
}

function list_option_alias() {
    $.ajax({
        url: "api/tanks.php?list-tanks",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            data.forEach(element => {
                const option = document.createElement('option');
                option.innerText = element.trigger_word;
                option.value = element.trigger_word;
                select.appendChild(option);
            })
        },
        error: function (result, status, error) {
            Swal.fire({
                title: "API Error while loading",
                text: error,
                icon: 'error'
            })
        }
    })
}

function add_alias() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='add-alias'>
            <label>Alias</label><input type='text' class='form-control' name='alias' required><br/>
            <label>Tank</label><select id='swal-select' class='form-control' name='value' required><option disabled selected> - Select a tank - </option></select>
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            list_option_alias();
        }
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_tanks.php', FORM_DATA).done(function () {
                list_alias(true);
            });
        }
    });
}

function del_alias(element) {
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
                action: "del-alias",
                alias: element.alias
            }, function () {
                list_alias(true)
            });
        }
    })
}