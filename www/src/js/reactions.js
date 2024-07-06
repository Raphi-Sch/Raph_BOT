function list(reload = false) {
    $.ajax({
        url: "api/reactions.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnEdit = createButton("btn btn-warning", "glyphicon glyphicon-pencil", () => reactionEdit(element));
                const btnDel  = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => reactionDelete(element));

                TR.appendChild(createTableData(element.trigger_word, 'col-xs-2'));
                TR.appendChild(createTableData(element.reaction, 'col-xs-5'));
                TR.appendChild(createTableData(element.frequency + '%', 'col-xs-1 text-center'));
                TR.appendChild(createTableData(timeoutToString(element.timeout), 'col-xs-1 text-center'));
                TR.appendChild(createCheckbox(element.tts));
                TR.appendChild(createButtonGroup(btnEdit, btnDel));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();
        },
        error: errorAPI
    })
}

function reactionTimeoutPreset(time){
    document.getElementById('swal-timeout').value = parseInt(time);
}

function reactionAdd() {
    Swal.fire({
        title: "Add entry",
        html: `<form id='swal-form'>
            <label>Trigger</label><input type='text' class='form-control' name='trigger' placeholder='Trigger' required><br/>
            <label>Reaction</label><textarea type='text' class='form-control' name='reaction' placeholder='Reaction' required></textarea><br/>
            <label>Frequency (<span id='swal-freq'>50</span>%)</label>
            <input type='range' class='form-control' name='frequency' min=0 max=100 step=1 value=50 oninput="document.getElementById('swal-freq').innerText = parseInt((this.value))"><br/>
            <label>Timeout</label><input type='number' class='form-control' name='timeout' id='swal-timeout' min=0 step=1 value=0 required><br/>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(0)'>0s</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(30)'>30s</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(60)'>1min</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(600)'>10min</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(1800)'>30min</button>
            <br/>
            <br/>
            <label>TTS</label><input class='form-control' type='checkbox' name='tts'><br/>
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
                'id': FORM.id.value,
                'trigger': FORM.trigger.value,
                'reaction': FORM.reaction.value,
                'frequency': FORM.frequency.value,
                'timeout': FORM.timeout.value,
                'tts': FORM.tts.checked,
            };
            
            $.ajax({
                url: "api/reactions.php",
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

function reactionEdit(data) {
    Swal.fire({
        title: `Editing : "${data.trigger_word}"`,
        icon: 'info',
        html: `<form id='swal-form'>
            <label>Trigger</label><input class='form-control' type='text' name='trigger' value="${data.trigger_word}"><br/>
            <label>Reaction</label><textarea class='form-control' type='text' name='reaction'>${data.reaction}</textarea><br/>
            <label>Frequency (<span id='swal-freq'>${data.frequency}</span>%)</label>
            <input type='range' class='form-control' name='frequency' min=0 max=100 step=1 value='${data.frequency}' oninput="document.getElementById('swal-freq').innerText = parseInt((this.value))"><br/>
            <label>Timeout (s)</label><input class='form-control' type='number' name='timeout' id='swal-timeout' min=0 step=1 value="${data.timeout}"><br/>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(0)'>0s</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(30)'>30s</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(60)'>1min</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(600)'>10min</button>
            <button type='button' class='btn btn-sml btn-info' onclick='reactionTimeoutPreset(1800)'>30min</button>
            <br/>
            <br/>
            <label>TTS</label><input class='form-control' type='checkbox' name='tts' ${data.tts ? "checked" : ""}><br />
            </form>`,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        width: "30%",
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.value) {
            const FORM =  document.getElementById('swal-form');
            const FORM_DATA = {
                'id': data.id,
                'trigger': FORM.trigger.value,
                'reaction': FORM.reaction.value,
                'frequency': FORM.frequency.value,
                'timeout': FORM.timeout.value,
                'tts': FORM.tts.checked,
            };
            
            $.ajax({
                url: "api/reactions.php",
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

function reactionDelete(data) {
    Swal.fire({
        title: `Delete '${data.trigger_word}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `api/reactions.php?id=${data.id}`,
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