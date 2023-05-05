const type = ["Word", "Consonant", "Vowel"];

function list(reload = false) {
    $.ajax({
        url: "api/shout.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => edit_entry(element));
                const btnDel  = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => del_entry(element));

                TR.appendChild(createTableData(element.original, 'col-xs-2'));
                TR.appendChild(createTableData(element.replacement, 'col-xs-2'));
                TR.appendChild(createTableData(element.language, 'col-xs-2'));
                TR.appendChild(createTableData(type[element.type], 'col-xs-2'));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <label>Original</label><input type='text' class='form-control' name='original' placeholder='Original' required><br/>
            <label>Replacement</label><input type='text' class='form-control' name='replacement' placeholder='Replacement' required><br/>
            <label>Language</label><select class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>
            <label>Type</label><select class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>
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
            const FORM =  document.getElementById('swal-form');
            const FORM_DATA = {
                'original': FORM.original.value,
                'replacement': FORM.replacement.value,
                'language': FORM.language.value,
                'type': FORM.type.value,
            };
            
            $.ajax({
                url: "api/shout.php",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    list(true);
                },
                error: errorAPI
            })
        }
    });
}

function edit_entry(data) {
    Swal.fire({
        title: `Editing : '${data.original}'`,
        icon: 'info',
        html: `<form id='swal-form'>
            <label>Original</label><input class='form-control' type='text' name='original' value="${data.original}"><br/>
            <label>Replacement</label><input class='form-control' type='text' name='replacement' value="${data.replacement}"><br/>
            <label>Language</label><select id='swal-select-lang' class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>
            <label>Type</label><select id='swal-select-type' class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            document.getElementById('swal-select-lang').value = data.language;
            document.getElementById('swal-select-type').value = data.type;
        }
    }).then((result) => {
        if (result.value) {
            const FORM =  document.getElementById('swal-form');
            const FORM_DATA = {
                'id' : data.id,
                'original': FORM.original.value,
                'replacement': FORM.replacement.value,
                'language': FORM.language.value,
                'type': FORM.type.value,
            };
            
            $.ajax({
                url: "api/shout.php",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    list(true);
                },
                error: errorAPI
            })
        }
    })
}

function del_entry(data) {
    Swal.fire({
        title: `Delete '${data.original}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/shout.php?id=${data.id}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    list(true);
                },
                error: errorAPI
            })
        }
    })
}