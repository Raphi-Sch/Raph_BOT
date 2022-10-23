<?php

require_once("./header-post.php");

if ($_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
    $alias = strtolower(trim($_POST['alias']));
    $command = trim($_POST['value']);

    db_query_no_result($db, "REPLACE INTO alias_commands (alias, command) VALUES (?, ?)", "ss", [$alias, $command]);

    header('Location: ../../alias_commands.php');
    exit();
}

// SYNC
// ----
// ASYNC

if ($_POST['action'] == "del" && !empty($_POST['alias'])) {
    db_query_no_result($db, "DELETE FROM alias_commands WHERE alias = ?", "s", $_POST['alias']);
    exit();
}

exit();
