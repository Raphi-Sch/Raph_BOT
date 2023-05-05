<?php

require_once("./header-post.php");

switch ($_POST['action']) {
    case "add-alias":
        alias_add($db);
        break;

    case "del-alias":
        alias_delete($db);
        break;

    case "add-audio":
        audio_add($db);
        break;

    case "edit-tts-config":
        tts_config_edit($db);
        break;

    default:
        exit();
}

exit();

function alias_add(mysqli $db)
{
    if (empty($_POST['alias']) || empty($_POST['value'])) {
        $_SESSION['alert'] = ['error', "Alias or Command empty", false];
        exit();
    }

    $alias = strtolower(trim($_POST['alias']));
    $command = trim($_POST['value']);

    db_query_no_result($db, "REPLACE INTO commands_alias (`id`, `alias`, `command`) VALUES (NULL, ?, ?)", "ss", [$alias, $command]);
    exit();
}

function alias_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM commands_alias WHERE id = ?", "s", $_POST['id']);
    exit();
}

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

function tts_config_edit(mysqli $db) {
    db_query_no_result(
        $db,
        "UPDATE `commands_tts_config` SET `value` = ? WHERE id = ?",
        "ss",
        [$_POST['value'], $_POST['id']]
    );

    exit();
}
