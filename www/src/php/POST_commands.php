<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['command'])) {
    $command = strtolower(trim($_POST['command']));
    $text = trim($_POST['text']);

    db_query_no_result($db, "INSERT INTO commands VALUES (NULL, ?, ?, 0)", "ss", [$command, $text]);

    header('Location: ../../commands.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $auto = isset($_POST['auto']) ? 1 : 0;
    $text = trim($_POST['value']);

    db_query_no_result($db, "UPDATE `commands` SET `value` = ?, `auto` = ? WHERE id = ?", "sii", [$text, $auto, $_POST['id']]);

    header('Location: ../../commands.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM commands WHERE id = ?", "i", $_POST['id']);
    exit();
}

exit();
