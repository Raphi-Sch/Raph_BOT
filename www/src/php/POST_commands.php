<?php

require_once("./header-post.php");

switch ($_POST['action']) {
    case "add-audio":
        audio_add($db);
        break;

    default:
        exit();
}

exit();

function audio_add(mysqli $db) {
    $name = trim($_POST['name']);
    $trigger = trim($_POST['trigger']);
    $volume = floatval($_POST['volume']);
    $timeout = intval($_POST['timeout']);
    $file_name = file_upload("audio", dirname(__FILE__) . "/../audio", "", false, guidv4());
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;

    if ($file_name) {
        db_query_no_result(
            $db,
            "INSERT INTO commands_audio (`id`, `name`, `trigger_word`, `file`, `volume`, `timeout`, `active`, `mod_only`, `sub_only`) VALUES (NULL, ?, ?, ?, ?, ?, 1, ?, ?)",
            "sssdiii",
            [$name, $trigger, $file_name, $volume, $timeout, $mod_only, $sub_only]
        );
    }

    header('Location: ../../commands.php?audio');
    exit();
}

