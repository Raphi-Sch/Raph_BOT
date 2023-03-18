$.ajax({
    url: "api/config.php?plugin",
    type: "GET",
    dataType: "json",
    success: function (data) {
        let title_enable = false;

        for (const id in data) {
            if (data[id] == "1") {
                title_enable = true;
                if(document.getElementById(id))
                    document.getElementById(id).classList.remove("hidden");
            }
        }

        if(title_enable)
            document.getElementById("plugin_title").classList.remove("hidden");
        else
            document.getElementById("plugin_title").classList.add("hidden");
    },
    error: (result, status, error) => errorAPI(result, status, error)
})
