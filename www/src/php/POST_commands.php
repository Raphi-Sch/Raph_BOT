<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['command'])) {
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);

    db_query_no_result($db, "INSERT INTO commands VALUES (NULL, ?, ?, 0)", "ss", [$command, $text]);

    header('Location: ../../commands.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['value']);
    $auto = isset($_POST['auto']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `commands` SET `command` = ?, `value` = ?, `auto` = ? WHERE id = ?", "ssii", [$command, $text, $auto, $_POST['id']]);

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
