function list(reload = false) {
    $.ajax({
        url: "api/moderator.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            for (const neddle in data) {
                // Base TR
                const TR = document.createElement('tr');

                // TD 1 (Trigger)
                const TD_1 = document.createElement('td');
                TD_1.classList.add('col-xs-2');
                TD_1.innerText = data[neddle]['trigger_word'];
                TR.appendChild(TD_1);

                // TD 2 (Mod action)
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-3');
                TD_2.innerText = data[neddle]['mod_action'];
                TR.appendChild(TD_2);

                // TD 3 (Explanation)
                const TD_3 = document.createElement('td');
                TD_3.classList.add('col-xs-4');
                TD_3.innerText = data[neddle]['explanation'];
                TR.appendChild(TD_3);

                // TD BTN (Btn)
                const TD_BTN = document.createElement('td');
                const SPAN = document.createElement('span');
                const BTN_1 = document.createElement('button');
                const BTN_2 = document.createElement('button');
                const ICO_1 = document.createElement('i');
                const ICO_2 = document.createElement('i');

                SPAN.className = "pull-right";

                BTN_1.className = "btn btn-warning";
                BTN_1.type = "button";
                BTN_1.onclick = function () { edit_entry(data[neddle]['id'], data[neddle]['trigger_word'], data[neddle]['mod_action'], data[neddle]['explanation']) };
                ICO_1.className = "glyphicon glyphicon-pencil";
                BTN_1.appendChild(ICO_1);
                SPAN.appendChild(BTN_1);
                SPAN.appendChild(document.createTextNode(" "));

                BTN_2.className = "btn btn-danger";
                BTN_2.type = "button";
                BTN_2.onclick = function () { del_entry(data[neddle]['id'], data[neddle]['trigger_word']) }
                ICO_2.className = "glyphicon glyphicon-remove";
                BTN_2.appendChild(ICO_2);
                SPAN.appendChild(BTN_2);

                TD_BTN.appendChild(SPAN);
                TR.appendChild(TD_BTN);

                LIST.appendChild(TR);

            }

            if(reload)
                reload_success();
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

function add_entry() {
    Swal.fire({
        title: "Add entry",
        html: "<form id='swal-form' method='post' action='src/php/POST_moderator.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Trigger word</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>" +
            "<label>Mod action</label><input type='text' class='form-control' name='mod_action' placeholder='Moderator action' required><br/>" +
            "<label>Explanation</label><textarea type='text' class='form-control' name='explanation' placeholder='Explanation' required></textarea><br/>" +
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

function edit_entry(id, trigger, mod, exp) {
    Swal.fire({
        title: `Editing : '${trigger}'`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_moderator.php'><br/>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Trigger</label><input class='form-control' type='text' name='trigger' value="${trigger}"><br/>` +
            `<label>Mod action</label><input class='form-control' type='text' name='mod_action' value="${mod}"><br/>` +
            `<label>Explanation</label><textarea class='form-control' type='text' name='explanation'>${exp}</textarea><br/>` +
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

function del_entry(id, trigger) {
    Swal.fire({
        title: `Delete "${trigger}" ?`,
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
                id: id
            }, function () {
                document.location.reload();
            });
        }
    })
}
