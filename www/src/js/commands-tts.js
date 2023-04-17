function listTTS(reload = false){
    $.ajax({
        url: "api/commands.php?list-tts-config",
        type: "GET",
        dataType: "json",
        success: function (data) {
            const LIST = document.getElementById('tbody-tts-config');
            LIST.innerHTML = "";

            console.log(data)

            data.forEach(element => {
                const TR = document.createElement('tr');

                TR.appendChild(createTableData(element.id, 'col-xs-2'));
                TR.appendChild(createTableData(element.value, 'col-xs-5'));
                TR.appendChild(createConfigButtonGroup(() => showHelp(element), () => editFunction(element)));

                LIST.appendChild(TR);
            })

            if (reload)
                reloadSuccess();

        },
        error: errorAPI
    })
}