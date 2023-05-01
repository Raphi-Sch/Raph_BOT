<?php

require_once("./header-post.php");

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $value = trim($_POST['value']);
    $id = $_POST['id'];

    $previous_value = db_query($db, 'SELECT `value` FROM config WHERE id = ?', "s", $id)['value'];

    db_query_no_result($db, "UPDATE config SET `value` = ? WHERE id = ?", "ss", [$value, $id]);

    $_SESSION['alert'] = ['success', 'Saved !', false, false];

    log_activity($db, $_SESSION['username'], "[CONFIG] Key edited", "$id : $previous_value → $value");
    exit();
}

exit();
