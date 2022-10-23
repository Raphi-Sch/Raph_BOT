<?php

require_once("./header-post.php");

if ($_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
    $alias = strtolower(trim($_POST['alias']));
    $tank = $_POST['value'];

    db_query_no_result($db, "REPLACE INTO alias_tanks VALUES (?, ?)", "ss", [$alias, $tank]);

    header('Location: ../../alias_tanks.php');
    exit();
}

// SYNC
// ----
// ASYNC

if (isset($_POST) && $_POST['action'] == "del") {
    db_query_no_result($db, "DELETE FROM alias_tanks WHERE alias = ?", "s", $_POST['alias']);
    exit();
}

exit();
