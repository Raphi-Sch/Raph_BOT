<?php

if (isset($_POST) && $_POST['action'] == "clear") {
    $f = @fopen("../activity.log", "r+");
    if ($f !== false) {
        ftruncate($f, 0);
        fclose($f);
    }
}

exit();
