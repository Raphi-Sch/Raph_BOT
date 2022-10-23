<?php

require_once("./header-post.php");

if (isset($_POST['action']) && $_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
    $alias = strtolower(trim($_POST['alias']));
    $nation = $_POST['value'];

    db_query_no_result($db, "REPLACE INTO alias_nation VALUES (?, ?)", "ss", [$alias, $nation]);

    header('Location: ../../alias_nation.php');
    exit();
}

// SYNC
// ----
// ASYNC

if (isset($_POST['action']) && $_POST['action'] == "del") {
    db_query_no_result($db, "DELETE FROM alias_nation WHERE alias = ?", "s", $_POST['alias']);
    exit();
}

exit();
