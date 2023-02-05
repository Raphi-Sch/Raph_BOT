function list(reload = false) {
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

                // TD Trigger
                const TD_TRIGGER = document.createElement('td');
                TD_TRIGGER.classList.add('col-xs-2');
                TD_TRIGGER.innerText = data[neddle]['trigger_word'];
                TR.appendChild(TD_TRIGGER);

                // TD Reaction
                const TD_REACTION = document.createElement('td');
                TD_REACTION.classList.add('col-xs-5');
                TD_REACTION.innerText = data[neddle]['reaction'];
                TR.appendChild(TD_REACTION);

                // TD Freq
                const TD_FREQ = document.createElement('td');
                TD_FREQ.classList.add('col-xs-1');
                TD_FREQ.classList.add('text-center');
                TD_FREQ.innerText = data[neddle]['frequency'] + "%";
                TR.appendChild(TD_FREQ);

                // TD Timeout
                const TD_TIMEOUT = document.createElement('td');
                TD_TIMEOUT.classList.add('col-xs-1');
                TD_TIMEOUT.classList.add('text-center');
                TD_TIMEOUT.innerText = timeout_to_string(data[neddle]['timeout']);
                TR.appendChild(TD_TIMEOUT);

                // TD BTN
                const TD_BTN = document.createElement('td');
                const SPAN_BTN = document.createElement('span');
                const BTN_EDIT = document.createElement('button');
                const BTN_DELETE = document.createElement('button');
                const ICO_EDIT = document.createElement('i');
                const ICO_DELETE = document.createElement('i');

                SPAN_BTN.className = "pull-right";

                BTN_EDIT.className = "btn btn-warning";
                BTN_EDIT.type = "button";
                BTN_EDIT.onclick = function () { edit_entry(data[neddle]['id'], data[neddle]['trigger_word'], data[neddle]['reaction'], data[neddle]['frequency'], data[neddle]['timeout']) };
                ICO_EDIT.className = "glyphicon glyphicon-pencil";
                BTN_EDIT.appendChild(ICO_EDIT);
                SPAN_BTN.appendChild(BTN_EDIT);
                SPAN_BTN.appendChild(document.createTextNode(" "));

                BTN_DELETE.className = "btn btn-danger";
                BTN_DELETE.type = "button";
                BTN_DELETE.onclick = function () { del_entry(data[neddle]['id'], data[neddle]['trigger_word']) }
                ICO_DELETE.className = "glyphicon glyphicon-remove";
                BTN_DELETE.appendChild(ICO_DELETE);
                SPAN_BTN.appendChild(BTN_DELETE);

                TD_BTN.appendChild(SPAN_BTN);
                TR.appendChild(TD_BTN);

                LIST.appendChild(TR);
            }

            if (reload)
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
        html: "<form id='swal-form' method='post'>" +
            "<input type='hidden' name='action' value='add'>" +
            "<label>Trigger</label><input type='text' class='form-control' name='trigger' placeholder='Trigger' required><br/>" +
            "<label>Reaction</label><textarea type='text' class='form-control' name='reaction' placeholder='Reaction' required></textarea><br/>" +
            `<label>Frequency (<span id='swal-freq'>50</span>%)</label><input type='range' class='form-control' name='frequency' min=0 max=100 step=1 value=50 oninput="document.getElementById('swal-freq').innerText = parseInt((this.value))"><br/>` +
            "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 value=0 required><br/>" +
            "</form>",
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
            $.post('src/php/POST_reactions.php', FORM_DATA).done(function () {
                list(true);
            });
        }
    });
}

function edit_entry(id, trigger, text, freq, time) {
    Swal.fire({
        title: `Editing : "${trigger}"`,
        icon: 'info',
        html: "<form id='swal-form' method='post'><br/>" +
            "<input type='hidden' name='action' value='edit'>" +
            `<input type='hidden' name='id' value='${id}'>` +
            `<label>Trigger</label><input class='form-control' type='text' name='trigger' value="${trigger}"><br/>` +
            `<label>Reaction</label><textarea class='form-control' type='text' name='reaction'>${text}</textarea><br/>` +
            `<label>Frequency (<span id='swal-freq'>${freq}</span>%)</label><input type='range' class='form-control' name='frequency' min=0 max=100 step=1 value='${freq}' oninput="document.getElementById('swal-freq').innerText = parseInt((this.value))"><br/>` +
            `<label>Timeout (s)</label><input class='form-control' type='number' name='timeout' min=0 step=1 value="${time}"><br/>` +
            "</form>",
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM_DATA = $(document.getElementById('swal-form')).serializeArray();
            $.post('src/php/POST_reactions.php', FORM_DATA).done(function () {
                list(true);
            });
        }
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
                list(true);
            });
        }
    })
}