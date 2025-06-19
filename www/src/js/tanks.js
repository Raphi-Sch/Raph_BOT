function view(param) {
    switch (param) {
        case 'tanks':
            document.getElementById("tab-tanks").classList.add("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-nation").classList.remove("active");

            document.getElementById('th-tanks').classList.remove('hidden');
            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-nation').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => tankList(true);

            window.history.pushState(null, '', 'tanks.php?tanks');
            tankList();
            return;

        case 'alias':
            document.getElementById("tab-tanks").classList.remove("active");
            document.getElementById("tab-alias").classList.add("active");
            document.getElementById("tab-nation").classList.remove("active");

            document.getElementById('th-tanks').classList.add('hidden');
            document.getElementById('th-alias').classList.remove('hidden');
            document.getElementById('th-nation').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => aliasList(true);

            window.history.pushState(null, '', 'tanks.php?alias');
            aliasList();
            return;

        case 'nation':
            document.getElementById("tab-tanks").classList.remove("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-nation").classList.add("active");

            document.getElementById('th-tanks').classList.add('hidden');
            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-nation').classList.remove('hidden');

            document.getElementById('btn-refresh').onclick = () => nationList(true);

            window.history.pushState(null, '', 'tanks.php?nation');
            nationList();
            return;
    }
}

function tankList(reload = false) {
    $.ajax({
        url: "api/tanks.php?list-tanks",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => tankEdit(element));
                const btnDel  = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => tankDelete(element));

                TR.appendChild(createTableData(element.trigger_word, 'col-xs-1'));
                TR.appendChild(createTableData(element.name, 'col-xs-2'));
                TR.appendChild(createTableData(element.nation, 'col-xs-1'));
                TR.appendChild(createTableData(element.tier, 'col-xs-1'));
                TR.appendChild(createTableData(element.mark, 'col-xs-1'));
                TR.appendChild(createTableData(element.max_dmg, 'col-xs-1'));
                TR.appendChild(createTableData(element.type, 'col-xs-1'));
                TR.appendChild(createTableData(element.note, 'col-xs-1'));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    })
}

function tankAdd() {
    Swal.fire({
        title: "New tank",
        html: `<form id='swal-form'>
            <label>Tank trigger</label><input type='text' class='form-control' name='trigger' required></br>
            <label>Tank name</label><input type='text' class='form-control' name='name' required></br>
            <label>Nation</label>
            <select class='form-control' name='nation' required>
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
                <option>ussr</option>
            </select></br>
            <label>Tier</label>
            <select class='form-control' name='tier' required>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select></br>
            <label>Type</label>
            <select class='form-control' name='type' required>
                <option>light</option>
                <option>medium</option>
                <option>heavy</option>
                <option>td</option>
                <option>spg</option>
            </select></br>
            <label>MoE</label>
            <select class='form-control' name='mark' required>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </select></br>
            <label>Damage max</label><input type='text' class='form-control' name='max_dmg' required></br>
            <label>Note</label><input type='text' class='form-control' name='note'/>
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
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'trigger': FORM.trigger.value,
                'name': FORM.name.value,
                'nation': FORM.nation.value,
                'tier': FORM.tier.value,
                'type': FORM.type.value,
                'mark': FORM.mark.value,
                'max_dmg': FORM.max_dmg.value,
                'note': FORM.note.value
            };

            $.ajax({
                url: "api/tanks.php?tank",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    tankList(true);
                },
                error: HttpError
            })
        }
    });
}

function tankEdit(data) {
    Swal.fire({
        title: `Editing : ${data.trigger_word}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <label>Trigger</label><input class='form-control' type='text' name='trigger' value='${data.trigger_word}'></br>
            <label>Tank name</label><input class='form-control' type='text' name='name' value='${data.name}'></br>
            <label>Mark</label><input class='form-control' type='number' min=0 max=3 name='mark' value='${data.mark}'></br>
            <label>Damage max</label><input class='form-control' type='number' name='max_dmg' value='${data.max_dmg}'></br>
            <label>Note</label><input class='form-control' type='text' name='note' value='${data.note}'></br>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'id' : data.id,
                'trigger': FORM.trigger.value,
                'name': FORM.name.value,
                'mark': FORM.mark.value,
                'max_dmg': FORM.max_dmg.value,
                'note': FORM.note.value
            };

            $.ajax({
                url: "api/tanks.php?tank",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    tankList(true);
                },
                error: HttpError
            })
        }
    })
}

function tankDelete(data) {
    Swal.fire({
        title: `Delete '${data.name}' ?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/tanks.php?tank&id=${data.id}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    tankList(true);
                },
                error: HttpError
            })
        }
    })
}

function nationList(reload = false){
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
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => nationDelete(element))));
                
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    }) 
}

function nationAdd() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <label>Alias</label><input type='text' class='form-control' name='alias'><br/>
            <label>Nation</label><select class='form-control' name='nation'>
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
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'alias': FORM.alias.value,
                'nation': FORM.nation.value
            };

            $.ajax({
                url: "api/tanks.php?nation",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    nationList(true);
                },
                error: HttpError
            })
        }
    });
}

function nationDelete(data) {
    Swal.fire({
        title: `Delete '${data.alias}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/tanks.php?nation&alias=${data.alias}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    nationList(true);
                },
                error: HttpError
            })
        }
    })
}

function aliasList(reload = false) {
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
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => aliasDelete(element))));
                
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    }) 
}

function aliasOptions() {
    $.ajax({
        url: "api/tanks.php?list-tanks",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let select = document.getElementById('swal-select');

            data.forEach(element => {
                select.appendChild(createOption(element.trigger_word, element.trigger_word));
            })
        },
        error: HttpError
    })
}

function aliasAdd() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <label>Alias</label><input type='text' class='form-control' name='alias'><br/>
            <label>Tank</label><select id='swal-select' class='form-control' name='tank'><option disabled selected> - Select a tank - </option></select>
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            aliasOptions();
        }
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'alias': FORM.alias.value,
                'tank': FORM.tank.value
            };

            $.ajax({
                url: "api/tanks.php?alias",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    aliasList(true);
                },
                error: HttpError
            })
        }
    });
}

function aliasDelete(data) {
    Swal.fire({
        title: `Delete '${data.alias}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/tanks.php?alias&alias=${data.alias}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    aliasList(true);
                },
                error: HttpError
            })
        }
    })
}