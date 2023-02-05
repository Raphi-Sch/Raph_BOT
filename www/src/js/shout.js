const type = ["Word", "Consonant", "Vowel"];

function list(reload = false) {
    $.ajax({
        url: "api/shout.php?list",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-list');
            LIST.innerHTML = "";

            for (const neddle in data) {
                // Base TR
                const TR = document.createElement('tr');

                // TD 1 (original)
                const TD_1 = document.createElement('td');
                TD_1.classList.add('col-xs-2');
                TD_1.innerText = data[neddle].original;
                TR.appendChild(TD_1);

                // TD 2 (replacement)
                const TD_2 = document.createElement('td');
                TD_2.classList.add('col-xs-2');
                TD_2.innerText = data[neddle].replacement;
                TR.appendChild(TD_2);

                // TD 3 (language)
                const TD_3 = document.createElement('td');
                TD_3.classList.add('col-xs-2');
                TD_3.innerText = data[neddle].language;
                TR.appendChild(TD_3);

                // TD 4 (Type)
                const TD_4 = document.createElement('td');
                TD_4.classList.add('col-xs-2');
                TD_4.innerText = type[data[neddle].type];
                TR.appendChild(TD_4);

                // TD 4 (Btn)
                const TD_BTN = document.createElement('td');
                const SPAN = document.createElement('span');
                const BTN_1 = document.createElement('button');
                const BTN_2 = document.createElement('button');
                const ICO_1 = document.createElement('i');
                const ICO_2 = document.createElement('i');

                TD_BTN.classList.add('col-xs-4');
                SPAN.className = "pull-right";

                BTN_1.className = "btn btn-warning";
                BTN_1.type = "button";
                BTN_1.onclick = function () { edit_entry(data[neddle].id, data[neddle].original, data[neddle].replacement, data[neddle].language, data[neddle].type) };
                ICO_1.className = "glyphicon glyphicon-pencil";
                BTN_1.appendChild(ICO_1);
                SPAN.appendChild(BTN_1);
                SPAN.appendChild(document.createTextNode(" "));

                BTN_2.className = "btn btn-danger";
                BTN_2.type = "button";
                BTN_2.onclick = function () { del_entry(data[neddle].id, data[neddle].original) }
                ICO_2.className = "glyphicon glyphicon-remove";
                BTN_2.appendChild(ICO_2);
                SPAN.appendChild(BTN_2);

                TD_BTN.appendChild(SPAN);
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
            "<label>Original</label><input type='text' class='form-control' name='original' placeholder='Original' required><br/>" +
            "<label>Replacement</label><input type='text' class='form-control' name='replacement' placeholder='Replacement' required><br/>" +
            "<label>Language</label><select class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>" +
            "<label>Type</label><select class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>" +
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
            $.post('src/php/POST_shout.php', FORM_DATA).done(function () {
                list(true);
            });
        }
    });
}

function edit_entry(id, original, replacement, language, type) {
    Swal.fire({
        title: 'Editing : "' + original + '"',
        icon: 'info',
        html: "<form id='swal-form' method='post' action='src/php/POST_shout.php'>" +
            "<input type='hidden' name='action' value='edit'>" +
            "<input type='hidden' name='id' value='" + id + "'>" +
            "<label>Replacement</label><input class='form-control' type='text' name='replacement' value=\"" + replacement + "\"><br/>" +
            "<label>Language</label><select id='swal-select-lang' class='form-control' name='language'><option>fr</option><option>fr-uwu</option></select><br/>" +
            "<label>Type</label><select id='swal-select-type' class='form-control' name='type'><option value=0>Word</option><option value=1>Consonant</option><option value=2>Vowel</option></select><br/>" +
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
            $.post('src/php/POST_shout.php', FORM_DATA).done(function () {
                list(true);
            });
        }
    })

    document.getElementById('swal-select-lang').value = language;
    document.getElementById('swal-select-type').value = type;
}

function del_entry(id, original) {
    Swal.fire({
        title: "Delete '" + original + "' ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_shout.php", {
                action: "del",
                id: id
            }, function () {
                list(true);
            });
        }
    })
}