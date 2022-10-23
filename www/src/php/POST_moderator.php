<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['mod_action']) && !empty($_POST['explanation'])) {
    $trigger = trim($_POST['trigger_word']);
    $mod_action = trim($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);

    db_query_no_result($db, "INSERT INTO `moderator` (id, trigger_word, mod_action, explanation) VALUES (NULL, ?, ?, ?)", "sss", [$trigger, $mod_action, $explanation]);

    header('Location: ../../moderator.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $mod_action = trim($_POST['mod_action']);
    $explanation = trim($_POST['explanation']);

    db_query_no_result($db, "UPDATE `moderator` SET `mod_action` = ?, `explanation` = ? WHERE `id` = ?", "ssi", [$mod_action, $explanation, $_POST['id']]);
    
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
