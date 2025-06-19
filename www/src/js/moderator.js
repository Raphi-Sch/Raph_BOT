const actionText = ["Ban", "Timeout", "Delete message", "Warn User"];

function view(param) {
    document.getElementById("tab-expression").classList.remove("active");
    document.getElementById("tab-leet").classList.remove("active");
    document.getElementById("tab-warning").classList.remove("active");
    document.getElementById("tab-warning-level").classList.remove("active");

    document.getElementById('div-expression').classList.add('hidden');
    document.getElementById('div-leet').classList.add('hidden');
    document.getElementById('div-warning').classList.add('hidden');
    document.getElementById('div-warning-level').classList.add('hidden');

    switch (param) {
        case 'expression':
            document.getElementById("tab-expression").classList.add("active");
            document.getElementById('div-expression').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => expressionList(true);

            window.history.pushState(null, '', 'moderator.php?expression');
            expressionList();
            return;

        case 'leet':
            document.getElementById("tab-leet").classList.add("active");
            document.getElementById('div-leet').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => leetList(true);

            window.history.pushState(null, '', 'moderator.php?leet');
            leetList();
            return;

        case 'warning':
            document.getElementById("tab-warning").classList.add("active");
            document.getElementById('div-warning').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => warningList(true);

            window.history.pushState(null, '', 'moderator.php?warning');
            warningList();
            return;

        case 'warning-level':
            document.getElementById('tab-warning-level').classList.add("active");
            document.getElementById('div-warning-level').classList.remove('hidden');
            document.getElementById('btn-refresh').onclick = () => warningLevelList(true);

            window.history.pushState(null, '', 'moderator.php?warning-level');
            warningLevelList();
            return;
    }
}

// Expressions
function expressionList(reload = false) {
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
                TR.appendChild(createTableData((element.mod_action ? element.duration : "N/A"), 'col-xs-1 text-center'));
                TR.appendChild(createTableData(element.seriousness, 'col-xs-1 text-center'));
                TR.appendChild(createTableData(element.reason, 'col-xs-2'));
                TR.appendChild(createTableData(element.explanation, 'col-xs-4'));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    })
}

function expressionAdd() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <label>Trigger</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>
            <label>Action</label>
            <select class='form-control' name='mod_action' onchange='expressionHideForm("swal-form")'>
                <option value=0>Ban</option>
                <option value=1>Timeout</option>
                <option value=2 disabled>Delete message (not available yet)</option>
                <option value=3>Warn user</option>
            </select><br/>
            <label id='swal-duration-label' class='hidden'>Duration</label>
                <input class='form-control hidden' type='number' name='duration' placeholder='Duration in seconds' value='30' step=1 min=0 max=1209600><br/ id='swal-duration-br' class='hidden'>
            <label>Seriousness</label>
                <input type='number' class='form-control' name='seriousness' placeholder='Level of seriousness compare to other expression' step=1 min=1 max=10><br/>
            <label>Reason</label>
                <textarea type='text' class='form-control' name='reason' placeholder='Reason given to user' required></textarea><br/>
            <label>Shaming</label>
                <textarea type='text' class='form-control' name='explanation' placeholder='Shaming in chat' required></textarea><br/>
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
                'trigger_word': FORM.trigger_word.value,
                'mod_action': FORM.mod_action.value,
                'reason': FORM.reason.value,
                'duration': FORM.duration.value,
                'explanation': FORM.explanation.value,
                'seriousness': FORM.seriousness.value
            };

            $.ajax({
                url: "api/moderator.php?expression",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    expressionList(true);
                },
                error: HttpError
            })
        }
    });
}

function expressionEdit(data) {
    Swal.fire({
        title: `Editing : '${data.trigger_word}'`,
        icon: 'info',
        html: `<form id='swal-form'><br/>
            <label>Trigger</label>
                <input class='form-control' type='text' name='trigger_word' value="${data.trigger_word}"><br/>
            <label>Action</label>
                <select class='form-control' name='mod_action' id='swal-select-action' onchange='expressionHideForm("swal-form")'>
                    <option value=0>Ban</option>
                    <option value=1>Timeout</option>
                    <option value=2 disabled>Delete message (not available yet)</option>
                    <option value=3>Warn user</option>
                </select><br/>
            <label id='swal-duration-label'>Duration</label>
                <input class='form-control' type='number' name='duration' placeholder='Duration in seconds' value='${data.duration}' step=1 min=0 max=1209600><br/ id='swal-duration-br'>
            <label>Seriousness</label>
                <input type='number' class='form-control' name='seriousness' placeholder='Duration in seconds' value='${data.seriousness}' step=1 min=1 max=10><br/>
            <label>Reason</label>
                <textarea class='form-control' type='text' name='reason'>${data.reason}</textarea><br/>
            <label>Explanation</label>
                <textarea class='form-control' type='text' name='explanation'>${data.explanation}</textarea><br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => { 
            document.getElementById('swal-select-action').value = data.mod_action;
            expressionHideForm("swal-form");
        }
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'id': data.id,
                'trigger_word': FORM.trigger_word.value,
                'mod_action': FORM.mod_action.value,
                'reason': FORM.reason.value,
                'duration': FORM.duration.value,
                'explanation': FORM.explanation.value,
                'seriousness': FORM.seriousness.value
            };

            $.ajax({
                url: "api/moderator.php?expression",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    expressionList(true);
                },
                error: HttpError
            })
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
            $.ajax({
                url: `api/moderator.php?expression&id=${data.id}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    expressionList(true);
                },
                error: HttpError
            })
        }
    })
}

function expressionHideForm(form){
    form = document.getElementById(form);
    switch(form.mod_action.value){
        case 1:
        case "1":
            form.duration.disabled = false;
            form.duration.classList.remove('hidden');
            document.getElementById("swal-duration-label").classList.remove('hidden');
            document.getElementById("swal-duration-br").classList.remove('hidden');
            break;

        default:
            form.duration.value = 0;
            form.duration.disabled = true;
            form.duration.classList.add('hidden');
            document.getElementById("swal-duration-label").classList.add('hidden');
            document.getElementById("swal-duration-br").classList.add('hidden');
            break;
    }
}

// Leet
function leetList(reload = false) {
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
                TR.appendChild(createButtonGroup(createButton("btn btn-danger", "glyphicon glyphicon-remove", () => leetDel(element))));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    })
}

function leetAdd() {
    Swal.fire({
        title: "Add leet conversion",
        html: "<form id='swal-form'>" +
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
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'original': FORM.original.value,
                'replacement': FORM.replacement.value
            };

            $.ajax({
                url: "api/moderator.php?leet",
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    leetList(true);
                },
                error: HttpError
            })
        }
    });
}

function leetDel(data) {
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
            $.ajax({
                url: `api/moderator.php?leet&id=${data.id}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    leetList(true);
                },
                error: HttpError
            })
        }
    })
}

// Warning
function warningList(reload) {
    $.ajax({
        url: "api/moderator.php?list-warning",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-warning');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnDel = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => warningDelete(element));

                TR.appendChild(createTableData(element.username, 'col-xs-2'));
                TR.appendChild(createTableData(element.count, 'col-xs-1'));
                TR.appendChild(createTableData(element.datetime_insert, 'col-xs-2'));
                TR.appendChild(createTableData(element.datetime_update, 'col-xs-2'));

                TR.appendChild(createButtonGroup(btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    })
}

function warningDelete(data) {
    Swal.fire({
        title: `Delete warning for "${data.username}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/moderator.php?warning&id=${data.id}`,
                type: "DELETE",
                dataType: "json",
                success: function () {
                    warningList(true);
                },
                error: HttpError
            })
        }
    })
}

// Warning Level
function warningLevelList(reload) {
    $.ajax({
        url: "api/moderator.php?warning-level",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-warning-level');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => warningLevelEdit(element));

                TR.appendChild(createTableData(element.level, 'col-xs-1'));
                TR.appendChild(createTableData(actionText[element.action], 'col-xs-1'));
                TR.appendChild(createTableData(element.duration, 'col-xs-1'));
                TR.appendChild(createTableData(element.reason, 'col-xs-4'));
                TR.appendChild(createTableData(element.explanation, 'col-xs-4'));
                TR.appendChild(createButtonGroup(btnEdit));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: HttpError
    })
}

function warningLevelEdit(element){
    Swal.fire({
        title: `Editing level : '${element.level}'`,
        icon: 'info',
        html: `<form id='swal-form'><br/>
            <label>Action</label>
            <select class='form-control' name='action' id='swal-select-action'>
                <option value=0>Ban</option>
                <option value=1>Timeout</option>
                <option value=2 disabled>Delete message (not available yet)</option>
            </select><br/>
            <label>Duration (timeout only)</label><input type='number' class='form-control' name='duration' placeholder='Duration in seconds' value='${element.duration}' step=1 min=0 max=1209600><br/>
            <label>Reason</label><textarea class='form-control' type='text' name='reason'>${element.reason}</textarea><br/>
            <label>Explanation</label><textarea class='form-control' type='text' name='explanation'>${element.explanation}</textarea><br/>
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        didOpen: () => {
            document.getElementById('swal-select-action').value = element.action;
        }
    }).then((result) => {
        if (result.value) {
            const FORM = document.getElementById('swal-form');
            const FORM_DATA = {
                'level': element.level,
                'action': FORM.action.value,
                'reason': FORM.reason.value,
                'duration': FORM.duration.value,
                'explanation': FORM.explanation.value
            };

            $.ajax({
                url: "api/moderator.php?warning-level",
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(FORM_DATA),
                success: function () {
                    warningLevelList(true);
                },
                error: HttpError
            })
        }
    })
}