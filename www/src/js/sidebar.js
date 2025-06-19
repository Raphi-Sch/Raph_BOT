$.ajax({
    url: "api/config.php?plugin",
    type: "GET",
    dataType: "json",
    success: function (data) {
        for (const id in data)
            if (data[id] != "1" && document.getElementById(id)) {
                let element = document.getElementById(id);
                element.classList.add("disabled");
                element.childNodes[0].href = "javascript: void(0)";

            }
    },
    error: HttpError
})
