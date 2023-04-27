const actionText = ["Ban", "Timeout", "Delete message"];

function view(param) {
    document.getElementById("tab-expression").classList.remove("active");
    document.getElementById("tab-leet").classList.remove("active");
    document.getElementById("tab-warning").classList.remove("active");

    document.getElementById('div-expression').classList.add('hidden');
    document.getElementById('div-leet').classList.add('hidden');
    document.getElementById('div-warning').classList.add('hidden');

    switch (param) {
        case 'expression':
            document.getElementById("tab-expression").classList.add("active");
            document.getElementById('div-expression').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => list(true);

            window.history.pushState(null, '', 'moderator.php?list');
            list();
            return;

        case 'leet':
            document.getElementById("tab-leet").classList.add("active");
            document.getElementById('div-leet').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => listLeet(true);

            window.history.pushState(null, '', 'moderator.php?list-leet');
            listLeet();
            return;

        case 'warning':
            document.getElementById("tab-warning").classList.add("active");
            document.getElementById('div-warning').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => listWarning(true);

            window.history.pushState(null, '', 'moderator.php?list-warning');
            listWarning();
            return;
    }
}

function list(reload = false) {
    $.ajax({
        url: "api/moderator.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-expression');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => expressionEdit(element));
                const btnDel = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => expressionDelete(element));

                TR.appendChild(createTableData(element.trigger_word, 'col-xs-2'));
                TR.appendChild(createTableData(actionText[element.mod_action], 'col-xs-1 text-center'));
                TR.appendChild(createTableData(element.reason, 'col-xs-2'));
                TR.appendChild(createTableData((element.mod_action ? element.duration : "N/A"), 'col-xs-1 text-center'));
                TR.appendChild(createTableData(element.explanation, 'col-xs-4'));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function expressionAdd() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <input type='hidden' name='action' value='add'>
            <label>Trigger</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>
            <label>Action</label>
            <select class='form-control' name='mod_action'>
                <option value=0>Ban</option>
                <option value=1>Timeout</option>
                <option value=2>Delete message</option>
            </select><br/>
            <label>Reason</label><textarea type='text' class='form-control' name='reason' placeholder='Reason given to user' required></textarea><br/>
            <label>Duration (timeout only)</label><input type='number' class='form-control' name='duration' placeholder='Duration in seconds' step=1 min=0 max=1209600><br/>
            <label>Shaming</label><textarea type='text' class='form-control' name='explanation' placeholder='Shaming in chat' required></textarea><br/>
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
            $.post('src/php/POST_moderator.php', FORM_DATA).done(function () {
                list(true);
            });
        }
    });
}

function expressionEdit(data) {
    Swal.fire({
        title: `Editing : '${data.trigger_word}'`,
        icon: 'info',
        html: `<form id='swal-form' method='post'><br/>
            <input type='hidden' name='action' value='edit'>
            <input type='hidden' name='id' value='${data.id}'>
            <label>Trigger</label><input class='form-control' type='text' name='trigger' value="${data.trigger_word}"><br/>
            <label>Action</label>
            <select class='form-control' name='mod_action' id='swal-select-action'>
                <option value=0>Ban</option>
                <option value=1>Timeout</option>
                <option value=2>Delete message</option>
            </select><br/>
            <label>Reason</label><textarea class='form-control' type='text' name='reason'>${data.reason}</textarea><br/>
            <label>Duration (timeout only)</label><input type='number' class='form-control' name='duration' placeholder='Duration in seconds' value='${data.duration}' step=1 min=0 max=1209600><br/>
            <label>Explanation</label><textarea class='form-control' type='text' name='explanation'>${data.explanation}</textarea><br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            document.getElementById('swal-select-action').value = data.mod_action;
        }
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_moderator.php', FORM_DATA).done(function () {
                list(true);
            });
        }
    })
}

function expressionDelete(data) {
    Swal.fire({
        title: `Delete "${data.trigger_word}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_moderator.php", {
                action: "del",
                id: data.id
            }, function () {
                list(true);
            });
        }
    })
}
