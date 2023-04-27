<?php

require_once("./header-post.php");

switch($_POST['action']){
    case "expression-add":
        expression_add($db);
        break;

    case "expression-edit":
        expression_edit($db);
        break;

    case "expression-del":
        expression_delete($db);
        break;

    case "leet-add":
        leet_add($db);
        exit();

    case "leet-del":
        leet_delete($db);
        break; 

    case "warning-del":
        warning_delete($db);
        break;

    default:
        exit();
}

exit();

function expression_add(mysqli $db){
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

function expression_edit(mysqli $db){
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

function expression_delete(mysqli $db){
    db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}

function leet_add(mysqli $db){
    $original = trim(strtolower($_POST['original']));
    $replacement = trim(strtolower($_POST['replacement']));

    db_query_no_result($db, "INSERT INTO `moderator_leet` (id, original, replacement) VALUES (NULL, ?, ?)", "ss", [$original, $replacement]);

    header('Location: ../../moderator.php');
    exit();
}

function leet_delete(mysqli $db){
    db_query_no_result($db, "DELETE FROM `moderator_leet` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}


function warning_delete(mysqli $db){
    db_query_no_result($db, "DELETE FROM `moderator_warning` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}
