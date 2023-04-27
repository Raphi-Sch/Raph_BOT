function listWarning(reload){
    $.ajax({
        url: "api/moderator.php?list-warning",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-warning');
            LIST.innerHTML = "";

            console.log(data);

            data.forEach(element => {
                const TR = document.createElement('tr');
                const btnDel = createButton("btn btn-danger", "glyphicon glyphicon-remove", () => deleteWarning(element));

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
        error: errorAPI
    })
}

function deleteWarning(data){
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
            $.post("src/php/POST_moderator.php", {
                action: "warning-del",
                id: data.id
            }, function () {
                listWarning(true);
            });
        }
    })
}