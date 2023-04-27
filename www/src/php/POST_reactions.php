<?php

require_once("./header-post.php");

switch($_POST['action']){
    case "add":
        reaction_add($db);
        break;

    case "edit":
        reaction_edit($db);
        break;

    case "del":
        reaction_delete($db);
        break;

    default:
        exit();
}

exit();

function reaction_add(mysqli $db){
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);
    $tts = isset($_POST['tts']) ? 1 : 0;

    db_query_no_result($db, "INSERT INTO reactions (`id`, `trigger_word`, `reaction`, `frequency`, `timeout`, `tts`) VALUES (NULL, ?, ?, ?, ?, ?)", "ssiii", [$trigger, $reaction, $frequency, $timeout, $tts]);
    exit();
}

function reaction_edit(mysqli $db){
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['trigger'])));
    $reaction = trim($_POST['reaction']);
    $frequency = intval($_POST['frequency']);
    $timeout = intval($_POST['timeout']);
    $tts = isset($_POST['tts']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `reactions` SET `trigger_word` = ?, `reaction` = ?, `frequency` = ?, `timeout` = ?, `tts` = ? WHERE `id` = ?", "ssiiii", [$trigger, $reaction, $frequency, $timeout, $tts, $_POST['id']]);
    exit();
}

function reaction_delete(mysqli $db){
    db_query_no_result($db, "DELETE FROM `reactions` WHERE `id` = ?", "i", $_POST['id']);
    exit();
}
