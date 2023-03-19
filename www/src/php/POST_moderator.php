<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['mod_action']) && !empty($_POST['explanation'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger_word'])));
    $mod_action = trim($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);
    $duration = trim($_POST['duration']);
    $reason = trim($_POST['reason']);

    if($mod_action == 0)
        $duration = 0;

    db_query_no_result($db, "INSERT INTO `moderator` (id, trigger_word, mod_action, explanation, duration, reason) VALUES (NULL, ?, ?, ?, ?, ?)", "sssis", [$trigger, $mod_action, $explanation, $duration, $reason]);

    header('Location: ../../moderator.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $mod_action = trim($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);
    $duration = trim($_POST['duration']);
    $reason = trim($_POST['reason']);

    if($mod_action == 0)
        $duration = 0;

    db_query_no_result($db, "UPDATE `moderator` SET `trigger_word` = ?, `mod_action` = ?, `explanation` = ?, `duration` = ?, `reason` = ? WHERE `id` = ?", "sssisi", [$trigger, $mod_action, $explanation, $duration, $reason, $_POST['id']]);
    
    header('Location: ../../moderator.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}

exit();
