$.ajax({
    url: "api/config.php?plugin",
    type: "GET",
    success: function (result) {
        data = JSON.parse(result);
        let title_enable = false;

        for (const id in data) {
            if (data[id] == "1") {
                title_enable = true;
                document.getElementById(id).classList.remove("hidden");
            }
        }

        document.getElementById("plugin_title").className = (title_enable ? "" : "hidden");
    },
    error: function (result, status, error) {
        Swal.fire({
            title: "API Error while loading",
            text: error,
            type: 'error'
        })
    }
})
