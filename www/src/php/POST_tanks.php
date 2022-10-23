<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['form_key']) && !empty($_POST['form_nation']) && !empty($_POST['form_tier']) && !empty($_POST['form_type']) && !empty($_POST['form_name'])) {
    $trigger_word = strtolower(trim($_POST['form_key']));
    $nation = trim($_POST['form_nation']);
    $tier = intval($_POST['form_tier']);
    $name = trim($_POST['form_name']);
    $mark = intval($_POST['form_mark']);
    $max_dmg = intval($_POST['form_max_dmg']);
    $type = trim($_POST['form_type']);
    $note = trim($_POST['form_note']);

    $max_dmg = empty($max_dmg) ? 0 : $max_dmg;

    db_query_no_result($db, "INSERT INTO tanks VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", "ssisiiss", [$trigger_word, $nation, $tier, $name, $mark, $max_dmg, $note, $type]);

    header('Location: ../../tanks.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit") {
    $trigger_word = trim($_POST['swal-trigger']);
    $name = trim($_POST['swal-name']);
    $dmg = intval($_POST['swal-dmg']);
    $mark = intval($_POST['swal-mark']);
    $note = trim($_POST['swal-note']);

    db_query_no_result($db, "UPDATE `tanks` SET `trigger_word` = ?, `name` = ?, `mark` = ?, `max_dmg` = ?, `note` = ? WHERE `id` = ?", "ssiisi", [$trigger_word, $name, $mark, $dmg, $note, $_POST['swal-key']]);

    header('Location: ../../tanks.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del") {
    db_query_no_result($db, "DELETE FROM tanks WHERE id= ?", "i", $_POST['id']);
    exit();
}

exit();
