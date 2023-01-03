<?php

require_once("./header-post.php");

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $value = trim($_POST['value']);

    db_query_no_result($db, "UPDATE config SET `value` = ? WHERE id = ?", "ss", [$value, $_POST['id']]);

    $_SESSION['alert'] = ['success', 'Saved !', false, false];

    header('Location: ../../config.php');
    exit();
}

exit();
