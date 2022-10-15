<?php
    if(!isset($_SESSION['alert']))
        $_SESSION['alert'] = false;

    $alert_type = false;
    if($_SESSION['alert']){
        $alert_type = $_SESSION['alert'][0];
        $alert_title = $_SESSION['alert'][1];
        $alert_text = $_SESSION['alert'][2];

        $_SESSION['alert'] = false;
    }
?>

<!-- Unified alert system -->
<script>
    $(document).ready(function() {<?php if(!empty($alert_type)) echo "Swal({type: \"$alert_type\", title: \"$alert_title\", text: \"$alert_text\"});"; ?>});
</script>
<!-- /Unified alert system -->