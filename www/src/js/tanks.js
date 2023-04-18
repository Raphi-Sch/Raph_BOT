function view(param) {
    switch (param) {
        case 'tanks':
            document.getElementById("tab-tanks").classList.add("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-nation").classList.remove("active");

            document.getElementById('th-tanks').classList.remove('hidden');
            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-nation').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => list_tanks(true);

            window.history.pushState(null, '', 'tanks.php?tanks');
            list_tanks();
            return;

        case 'alias':
            document.getElementById("tab-tanks").classList.remove("active");
            document.getElementById("tab-alias").classList.add("active");
            document.getElementById("tab-nation").classList.remove("active");

            document.getElementById('th-tanks').classList.add('hidden');
            document.getElementById('th-alias').classList.remove('hidden');
            document.getElementById('th-nation').classList.add('hidden');

            document.getElementById('btn-refresh').onclick = () => list_alias(true);

            window.history.pushState(null, '', 'tanks.php?alias');
            list_alias();
            return;

        case 'nation':
            document.getElementById("tab-tanks").classList.remove("active");
            document.getElementById("tab-alias").classList.remove("active");
            document.getElementById("tab-nation").classList.add("active");

            document.getElementById('th-tanks').classList.add('hidden');
            document.getElementById('th-alias').classList.add('hidden');
            document.getElementById('th-nation').classList.remove('hidden');

            document.getElementById('btn-refresh').onclick = () => list_nation(true);

            window.history.pushState(null, '', 'tanks.php?nation');
            list_nation();
            return;
    }
}

function list_tanks(reload = false) {
    $.ajax({
        url: "api/tanks.php?list-tanks",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.trigger_word, 'col-xs-1'));
                TR.appendChild(createTableData(element.name, 'col-xs-2'));
                TR.appendChild(createTableData(element.nation, 'col-xs-1'));
                TR.appendChild(createTableData(element.tier, 'col-xs-1'));
                TR.appendChild(createTableData(element.mark, 'col-xs-1'));
                TR.appendChild(createTableData(element.max_dmg, 'col-xs-1'));
                TR.appendChild(createTableData(element.type, 'col-xs-1'));
                TR.appendChild(createTableData(element.note, 'col-xs-1'));
                TR.appendChild(createButtonGroupEditDelete(() => edit_tank(element), () => del_tank(element)));
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function add_tank() {
    Swal.fire({
        title: "New tank",
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='add-tank'>
            <label>Tank trigger</label><input type='text' class='form-control' name='form_key' required></br>
            <label>Tank name</label><input type='text' class='form-control' name='form_name' required></br>
            <label>Nation</label>
            <select class='form-control' name='form_nation' required>
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
            <select class='form-control' name='form_tier' required>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select></br>
            <label>Type</label>
            <select class='form-control' name='form_type' required>
                <option>light</option>
                <option>medium</option>
                <option>heavy</option>
                <option>td</option>
                <option>spg</option>
            </select></br>
            <label>MoE</label>
            <select class='form-control' name='form_mark' required>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </select></br>
            <label>Damage max</label><input type='text' class='form-control' name='form_max_dmg' required></br>
            <label>Note</label><input type='text' class='form-control' name='form_note'/>
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
                list_tanks(true);
            });
        }
    });
}

function edit_tank(data) {
    Swal.fire({
        title: `Editing : ${data.trigger_word}`,
        icon: 'info',
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='edit-tank'>
            <input type='hidden' name='swal-key' value='${data.id}'>
            <label>Trigger</label><input class='form-control' type='text' name='swal-trigger' value='${data.trigger_word}'></br>
            <label>Tank name</label><input class='form-control' type='text' name='swal-name' value='${data.name}'></br>
            <label>Mark</label><input class='form-control' type='number' min=0 max=3 name='swal-mark' value='${data.mark}'></br>
            <label>Damage max</label><input class='form-control' type='number' name='swal-dmg' value='${data.max_dmg}'></br>
            <label>Note</label><input class='form-control' type='text' name='swal-note' value='${data.note}'></br>
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
            $.post('src/php/POST_tanks.php', FORM_DATA).done(function () {
                list_tanks(true);
            });
        }
    })
}

function del_tank(data) {
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
            $.post("src/php/POST_tanks.php", {
                action: "del-tank",
                id: data.id
            }, function () {
                list_tanks(true)
            });
        }
    })
}
