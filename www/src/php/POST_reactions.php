<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['reaction'])) {
    $trigger_word = strtolower(trim($_POST['trigger_word']));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);

    db_query_no_result($db, "INSERT INTO reactions VALUES (NULL, ?, ?, ?, ?)", "ssii", [$trigger_word, $reaction, $frequency, $timeout]);

    header('Location: ../../reactions.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $reaction = trim($_POST['value']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);

    db_query_no_result($db, "UPDATE `reactions` SET `reaction` = ?, `frequency` = ?, `timeout` = ? WHERE `id` = ?", "siii", [$reaction, $frequency, $timeout, $_POST['id']]);

    header('Location: ../../reactions.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM `reactions` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}

exit();
