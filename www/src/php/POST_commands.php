<?php

require_once("./header-post.php");

switch ($_POST['action']) {
    case "add":
        command_add($db);
        break;

    case "edit":
        command_edit($db);
        break;

    case "del":
        command_delete($db);
        break;

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

function command_add(mysqli $db)
{
    if (empty($_POST['command']) || empty($_POST['text'])) {
        $_SESSION['alert'] = ['error', "Command trigger or text empty", false];
        header('Location: ../../commands.php');
        exit();
    }

    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);
    $auto = isset($_POST['auto']) ? 1 : 0;
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;
    $tts = isset($_POST['tts']) ? 1 : 0;

    if ($auto)
        $tts = 0;

    db_query_no_result($db, "INSERT INTO commands (`id`, `command`, `value`, `auto`, `mod_only`, `sub_only`, `tts`) VALUES (NULL, ?, ?, ?, ?, ?, ?)", "ssiiii", [$command, $text, $auto, $mod_only, $sub_only, $tts]);
    exit();
}

function command_edit(mysqli $db)
{
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);
    $auto = isset($_POST['auto']) ? 1 : 0;
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;
    $tts = isset($_POST['tts']) ? 1 : 0;

    if ($auto)
        $tts = 0;

    db_query_no_result(
        $db,
        "UPDATE `commands` SET `command` = ?, `value` = ?, `auto` = ?, `mod_only` = ?, `sub_only` = ?, `tts` = ? WHERE id = ?",
        "ssiiiii",
        [$command, $text, $auto, $mod_only, $sub_only, $tts, $_POST['id']]
    );

    exit();
}

function command_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM commands WHERE id = ?", "i", $_POST['id']);
    exit();
}

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
