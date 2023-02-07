<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['original']) && !empty($_POST['replacement'])) {
    $original = trim($_POST['original']);
    $replacement = trim($_POST['replacement']);

    db_query_no_result($db, "INSERT INTO shout (`id`, `original`, `replacement`, `language`, `type`) VALUES (NULL, ?, ?, ?, ?)", "sssi", [$original, $replacement, $_POST['language'], $_POST['type']]);
    
    header('Location: ../../shout.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id']) && !empty($_POST['replacement'])) {
    $replacement = trim($_POST['replacement']);

    db_query_no_result($db, "UPDATE `shout` SET `replacement` = ?, `language` = ?, `type` = ? WHERE `id` = ?", "ssii", [$replacement, $_POST['language'], $_POST['type'], $_POST['id']]);

    header('Location: ../../shout.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    db_query_no_result($db, "DELETE FROM shout WHERE id = ?", "i", $_POST['id']);
    exit();
}

exit();
