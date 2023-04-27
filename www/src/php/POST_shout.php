<?php

require_once("./header-post.php");

switch ($_POST['action']) {
    case "add":
        shout_add($db);
        break;

    case "edit":
        shout_edit($db);
        break;

    case "del":
        shout_delete($db);
        break;

    default:
        exit();
}

exit();

function shout_add(mysqli $db)
{
    $original = trim($_POST['original']);
    $replacement = trim($_POST['replacement']);
    db_query_no_result($db, "INSERT INTO shout (`id`, `original`, `replacement`, `language`, `type`) VALUES (NULL, ?, ?, ?, ?)", "sssi", [$original, $replacement, $_POST['language'], $_POST['type']]);
    exit();
}

function shout_edit(mysqli $db)
{
    $replacement = trim($_POST['replacement']);
    db_query_no_result($db, "UPDATE `shout` SET `replacement` = ?, `language` = ?, `type` = ? WHERE `id` = ?", "ssii", [$replacement, $_POST['language'], $_POST['type'], $_POST['id']]);
    exit();
}

function shout_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM shout WHERE id = ?", "i", $_POST['id']);
    exit();
}
