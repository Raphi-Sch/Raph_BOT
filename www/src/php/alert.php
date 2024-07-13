<?php
if (!isset($_SESSION['alert'])) {
    $_SESSION['alert'] = null;
}
?>

<!-- Unified alert system -->
<script>
    $(document).ready(function() {
        <?php 
            if (!empty($_SESSION['alert'])){
                echo "Swal.fire({icon: \"" . $_SESSION['alert'][0] . "\", title: \"" . $_SESSION['alert'][1] . "\", text: \"" . $_SESSION['alert'][2] . "\", toast: \"" . $_SESSION['alert'][3] . "\"});"; 
                $_SESSION['alert'] = false; // Clear alert
            }
        ?>
    });
</script>
<!-- /Unified alert system -->