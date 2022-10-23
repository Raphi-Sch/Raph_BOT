function add_entry() {
    Swal.fire({
        title: "New tank",
        html: "<form id='swal-form' method='post' action='src/php/POST_tanks.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            // Key
            "<label>Tank trigger</label><input type='text' class='form-control' name='form_key' required></br>" +
            // Name
            "<label>Tank name</label><input type='text' class='form-control' name='form_name' required></br>" +
            // Nation
            "<label>Nation</label><select class='form-control' name='form_nation' required><option>china</option><option>czechoslovakia</option><option>france</option>" +
            "<option>germany</option><option>italy</option><option>japan</option><option>poland</option><option>sweden</option><option>uk</option><option>usa</option><option>ussr</option></select></br>" +
            // Tier
            "<label>Tier</label><select class='form-control' name='form_tier' required><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></br>" +
            // Type
            "<label>Type</label><select class='form-control' name='form_type' required><option>light</option><option>medium</option><option>heavy</option><option>td</option><option>spg</option></select></br>" +
            // Mark
            "<label>MoE</label><select class='form-control' name='form_mark' required><option>0</option><option>1</option><option>2</option><option>3</option></select></br>" +
            // Max dmg
            "<label>Damage max</label><input type='text' class='form-control' name='form_max_dmg' required></br>" +
            // Note
            "<label>Note</label><input type='text' class='form-control' name='form_note'/>" +
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

function edit_entry(id) {
    var tank = document.getElementById(id).children;
    var trigger_word = tank.trigger_word.textContent;
    var name = tank.name.textContent;
    var mark = tank.mark.textContent;
    var max_dmg = tank.max_dmg.textContent;
    var note = tank.note.textContent;

    Swal.fire({
        title: 'Editing : "' + trigger_word + '"',
        type: 'info',
        html: "<form id='swal-form' method='post' class='form-vertical' action='src/php/POST_tanks.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='swal-key' value='" + id + "'>" +
            "<label>Trigger</label><input class='form-control' type='text' name='swal-trigger' value='" + trigger_word + "'></br>" +
            "<label>Tank name</label><input class='form-control' type='text' name='swal-name' value='" + name + "'></br>" +
            "<label>Mark</label><input class='form-control' type='number' min=0 max=3 name='swal-mark' value='" + mark + "'></br>" +
            "<label>Damage max</label><input class='form-control' type='number' name='swal-dmg' value='" + max_dmg + "'></br>" +
            "<label>Note</label><input class='form-control' type='text' name='swal-note' value='" + note + "'></br>" +
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
}

// SYNC
// ----
// ASYNC

function del_entry(id, name) {
    Swal.fire({
        title: "Delete '" + name + "' ?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_tanks.php", {
                action: "del",
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}