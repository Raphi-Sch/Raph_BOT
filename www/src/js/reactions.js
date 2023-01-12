function list() {
    $.ajax({
        url: "api/reactions.php?list",
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

                // TD 2 (Reaction)
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-6');
                TD_2.innerText = data[neddle]['reaction'];
                TR.appendChild(TD_2);

                // TD 3 (Freq)
                const TD_3 = document.createElement('td');
                TD_3.classList.add('col-xs-1');
                TD_3.innerText = data[neddle]['frequency'];
                TR.appendChild(TD_3);

                // TD 4 (Freq)
                const TD_4 = document.createElement('td');
                TD_4.classList.add('col-xs-1');
                TD_4.innerText = data[neddle]['timeout'];
                TR.appendChild(TD_4);

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
                BTN_1.onclick = function () { edit_entry(data[neddle]['id'], data[neddle]['trigger_word'], data[neddle]['reaction'], data[neddle]['frequency'], data[neddle]['timeout']) };
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
        html: "<form id='swal-form' method='post' action='src/php/POST_reactions.php'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' placeholder='Trigger' required><br/>" +
            "<label>Reaction</label><textarea type='text' class='form-control' name='reaction' placeholder='Reaction' required></textarea><br/>" +
            "<label>Frequency</label><input type='number' class='form-control' name='frequency' min=0 step=1 max=100 required><br/>" +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 required><br/>" +
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

function edit_entry(id, trigger, text, freq, time) {
    Swal.fire({
        title: `Editing : "${trigger}"`,
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_reactions.php'><br/>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Trigger</label><input class='form-control' type='text' name='trigger' value="${trigger}"><br/>` +
            `<label>Reaction</label><textarea class='form-control' type='text' name='reaction'>${text}</textarea><br/>` +
            `<label>Frequency (%)</label><input class='form-control' type='number' name='frequency' min=0 step=1 max=100 value="${freq}"><br/>` +
            `<label>Timeout (s)</label><input class='form-control' type='number' name='timeout' min=0 step=1 value="${time}"><br/>` +
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
        title: "Delete '" + trigger + "' ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_reactions.php", {
                action: "del",
                id: id
            }, function () {
                list(); // Dynamic reload
            });
        }
    })
}