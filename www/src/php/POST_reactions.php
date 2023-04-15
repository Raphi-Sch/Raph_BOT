<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger']) && !empty($_POST['reaction'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);
    $tts = isset($_POST['tts']) ? 1 : 0;

    db_query_no_result($db, "INSERT INTO reactions (`id`, `trigger_word`, `reaction`, `frequency`, `timeout`, `tts`) VALUES (NULL, ?, ?, ?, ?, ?)", "ssiii", [$trigger, $reaction, $frequency, $timeout, $tts]);

    header('Location: ../../reactions.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);
    $tts = isset($_POST['tts']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `reactions` SET `trigger_word` = ?, `reaction` = ?, `frequency` = ?, `timeout` = ?, `tts` = ? WHERE `id` = ?", "ssiiii", [$trigger, $reaction, $frequency, $timeout, $tts, $_POST['id']]);

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
