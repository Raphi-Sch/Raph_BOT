<?php

require_once("./header-post.php");

// Commands
if ($_POST['action'] == "add") {
    if(empty($_POST['command']) || empty($_POST['text'])){
        $_SESSION['alert'] = ['error', "Command trigger or text empty", false];
        header('Location: ../../commands.php');
        exit();
    }

    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);
    $auto = isset($_POST['auto']) ? 1 : 0;
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;

    db_query_no_result($db, "INSERT INTO commands (`id`, `command`, `value`, `auto`, `mod_only`, `sub_only`) VALUES (NULL, ?, ?, ?, ?, ?)", "ssiii", [$command, $text, $auto, $mod_only, $sub_only]);

    header('Location: ../../commands.php');
    exit();
}

if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);
    $auto = isset($_POST['auto']) ? 1 : 0;
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `commands` SET `command` = ?, `value` = ?, `auto` = ?, `mod_only` = ?, `sub_only` = ? WHERE id = ?", 
        "ssiiii", [$command, $text, $auto, $mod_only, $sub_only, $_POST['id']]);

    header('Location: ../../commands.php');
    exit();
}

if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM commands WHERE id = ?", "i", $_POST['id']);
    exit();
}


// Alias
if ($_POST['action'] == "add-alias") {
    if(empty($_POST['alias']) || empty($_POST['value'])){
        $_SESSION['alert'] = ['error', "Alias or Command empty", false];
        header('Location: ../../commands.php?alias');
        exit();
    }

    $alias = strtolower(trim($_POST['alias']));
    $command = trim($_POST['value']);

    db_query_no_result($db, "REPLACE INTO commands_alias (`id`, `alias`, `command`) VALUES (NULL, ?, ?)", "ss", [$alias, $command]);

    header('Location: ../../commands.php?alias');
    exit();
}

if ($_POST['action'] == "del-alias" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM commands_alias WHERE id = ?", "s", $_POST['id']);
    exit();
}

// Audio
if ($_POST['action'] == "add-audio" && !empty($_POST['name']) && !empty($_POST['trigger'])) {
    $name = trim($_POST['name']);
    $trigger = trim($_POST['trigger']);
    $volume = floatval($_POST['volume']);
    $timeout = intval($_POST['timeout']);
    $file_name = file_upload("audio", dirname(__FILE__) . "/../audio", "", false, guidv4());
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;

    if ($file_name) {
        db_query_no_result($db, "INSERT INTO commands_audio (`id`, `name`, `trigger_word`, `file`, `volume`, `timeout`, `active`, `mod_only`, `sub_only`) VALUES (NULL, ?, ?, ?, ?, ?, 1, ?, ?)", 
            "sssdiii", [$name, $trigger, $file_name, $volume, $timeout, $mod_only, $sub_only]);
    }

    header('Location: ../../commands.php?audio');
    exit();
}

if ($_POST['action'] == "edit-audio" && !empty($_POST['id'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $trigger = $_POST['trigger'];
    $volume = floatval($_POST['volume']);
    $timeout = intval($_POST['timeout']);
    $active = isset($_POST['active']) ? 1 : 0;
    $mod_only = (isset($_POST['mod_only']) ? 1 : 0) || (isset($_POST['sub_only']) ? 1 : 0);
    $sub_only = isset($_POST['sub_only']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `commands_audio` SET `name` = ?, `trigger_word` = ?, `volume` = ?, `timeout` = ?, `active` = ?, `mod_only` = ?, `sub_only` = ? WHERE id = ?", 
        "ssdiiiii", [$name, $trigger, $volume, $timeout, $active, $mod_only, $sub_only, $id]);

    header('Location: ../../commands.php?audio');
    exit();
}

if ($_POST['action'] == "del-audio" && !empty($_POST['id'])) {
    $id = $_POST['id'];

    // Get filename
    $file = db_query($db, "SELECT `file` FROM commands_audio WHERE id = ?", "i", $id)['file'];

    // Remove file
    shell_exec("rm ../audio/$file");

    // Remove from database
    db_query_no_result($db, "DELETE FROM commands_audio WHERE id = ?", "i", $id);

    exit();
}


exit();
