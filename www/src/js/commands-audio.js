function list_audio(reload = false) {
    $.ajax({
        url: "api/commands.php?list-audio",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                TR.appendChild(createTableData(element.name, 'col-xs-2'));
                TR.appendChild(createTableData(element.trigger_word, 'col-xs-1'));
                TR.appendChild(createTableData(parseInt(element.volume * 100) + '%', 'col-xs-1 text-center'));
                TR.appendChild(createTableData(timeoutToString(element.timeout), 'col-xs-1 text-center'));
                TR.appendChild(createCheckbox(element.active));
                TR.appendChild(createCheckbox(element.mod_only));
                TR.appendChild(createCheckbox(element.sub_only));
                TR.appendChild(createPlayer(element));
                TR.appendChild(createButtonGroup(() => edit_audio(element), () => del_audio(element)))
                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();

        },
        error: errorAPI
    })
}

function add_audio() {
    Swal.fire({
        title: "Add audio command",
        html: `<form id='swal-form' method='post' enctype='multipart/form-data' action='src/php/POST_commands.php'>
            <input type='hidden' name='action' value='add-audio'>
            <label>Name</label><input type='text' class='form-control' name='name' required><br/>
            <label>Trigger</label><input type='text' class='form-control' name='trigger' required><br/>
            <label>Volume</label><input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value=0.5)><br/>
            <label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 value=0><br/>
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only'><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only'><br />
            <label>File</label><input type='file' class='form-control' name='audio' accept='.mp3' required>
            </form>`,
        showCancelButton: true,
        showConfirmButton: true,
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

function del_audio(data) {
    Swal.fire({
        title: `Delete : '${data.name}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_commands.php", {
                action: "del-audio",
                id: data.id
            }, function () {
                list_audio(true);
            });
        }
    })
}

function edit_audio(data) {
    Swal.fire({
        title: `Edit : '${data.name}'`,
        html: `<form id='swal-form' method='post'>
            <input type='hidden' name='action' value='edit-audio'>
            <input type='hidden' name='id' value='${data.id}'>
            <label>Name</label><input type='text' class='form-control' name='name' value="${data.name}" required><br/>
            <label>Trigger</label><input type='text' class='form-control' name='trigger' value='${data.trigger_word}'  required><br/>
            <label>Volume (<span id='swal-volume'>${parseInt(data.volume * 100)}</span>%)</label>
            <input type='range' class='form-control' name='volume' min=0 max=1 step=0.05 value='${data.volume}' oninput="document.getElementById('swal-volume').innerText = parseInt(this.value*100)"><br/>
            <label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 value='${data.timeout}')><br/>
            <label>Active</label><input class='form-control' type='checkbox' name='active' ${data.active ? "checked" : ""}><br />
            <label>Mod Only</label><input class='form-control' type='checkbox' name='mod_only' ${data.mod_only ? "checked" : ""}><br />
            <label>Sub Only</label><input class='form-control' type='checkbox' name='sub_only' ${data.sub_only ? "checked" : ""}><br />
            </form>`,
        showCancelButton: true,
        showConfirmButton: confirm,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "25%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_commands.php', FORM_DATA).done(function () {
                list_audio(true);
            });
        }
    });
}