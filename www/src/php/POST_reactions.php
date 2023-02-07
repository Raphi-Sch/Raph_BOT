<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger']) && !empty($_POST['reaction'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);

    db_query_no_result($db, "INSERT INTO reactions (`id`, `trigger_word`, `reaction`, `frequency`, `timeout`) VALUES (NULL, ?, ?, ?, ?)", "ssii", [$trigger, $reaction, $frequency, $timeout]);

    header('Location: ../../reactions.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);

    db_query_no_result($db, "UPDATE `reactions` SET `trigger_word` = ?, `reaction` = ?, `frequency` = ?, `timeout` = ? WHERE `id` = ?", "ssiii", [$trigger, $reaction, $frequency, $timeout, $_POST['id']]);

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
