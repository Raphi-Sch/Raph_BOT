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

    db_query_no_result($db, "INSERT INTO commands VALUES (NULL, ?, ?, ?)", "ssi", [$command, $text, $auto]);

    header('Location: ../../commands.php');
    exit();
}

if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($_POST['command'])));
    $text = trim($_POST['text']);
    $auto = isset($_POST['auto']) ? 1 : 0;

    db_query_no_result($db, "UPDATE `commands` SET `command` = ?, `value` = ?, `auto` = ? WHERE id = ?", "ssii", [$command, $text, $auto, $_POST['id']]);

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

    db_query_no_result($db, "REPLACE INTO alias_commands (alias, command) VALUES (?, ?)", "ss", [$alias, $command]);

    header('Location: ../../commands.php?alias');
    exit();
}

if ($_POST['action'] == "del-alias" && !empty($_POST['alias'])) {
    db_query_no_result($db, "DELETE FROM alias_commands WHERE alias = ?", "s", $_POST['alias']);
    exit();
}


exit();
