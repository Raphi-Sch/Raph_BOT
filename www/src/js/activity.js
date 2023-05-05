function clearActivity() {
    Swal.fire({
        title: `Clear activity log ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            $.post("src/php/POST_activity.php", { action: "clear" }, function () { document.location.reload() });
        }
    })
}