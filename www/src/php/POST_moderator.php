<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger_word'])) {
    $trigger = trim(strtolower($_POST['trigger_word']));
    $mod_action = intval($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);
    $duration = intval($_POST['duration']);
    $reason = trim($_POST['reason']);

    if($mod_action == 0)
        $duration = 0;

    if($duration > 1209600)
        $duration = 1209600;

    db_query_no_result($db, "INSERT INTO `moderator` (id, trigger_word, mod_action, explanation, duration, reason) VALUES (NULL, ?, ?, ?, ?, ?)", "sisis", [$trigger, $mod_action, $explanation, $duration, $reason]);

    header('Location: ../../moderator.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $trigger = trim(strtolower($_POST['trigger']));
    $mod_action = trim($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);
    $duration = trim($_POST['duration']);
    $reason = trim($_POST['reason']);

    if($mod_action == 0)
        $duration = 0;

    db_query_no_result($db, "UPDATE `moderator` SET `trigger_word` = ?, `mod_action` = ?, `explanation` = ?, `duration` = ?, `reason` = ? WHERE `id` = ?", "sisisi", [$trigger, $mod_action, $explanation, $duration, $reason, $_POST['id']]);
    
    header('Location: ../../moderator.php');
    exit();
}

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}

// LEET
// Add
if ($_POST['action'] == "add-leet" && !empty($_POST['original']) && !empty($_POST['replacement'])) {
    $original = trim(strtolower($_POST['original']));
    $replacement = trim(strtolower($_POST['replacement']));

    db_query_no_result($db, "INSERT INTO `moderator_leet` (id, original, replacement) VALUES (NULL, ?, ?)", "ss", [$original, $replacement]);

    header('Location: ../../moderator.php');
    exit();
}

// Delete
if ($_POST['action'] == "del-leet" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM `moderator_leet` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}

exit();
