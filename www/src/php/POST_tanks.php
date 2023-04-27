<?php

require_once("./header-post.php");

switch ($_POST['action']) {
    case "add-tank":
        tank_add($db);
        break;

    case "edit-tank":
        tank_edit($db);
        break;

    case "del-tank":
        tank_delete($db);
        break;

    case "add-nation":
        nation_add($db);
        break;

    case "del-nation":
        nation_delete($db);
        break;

    case "add-alias":
        alias_add($db);
        break;

    case "del-alias":
        alias_delete($db);
        break;

    default:
        exit();
}

exit();

function tank_add(mysqli $db)
{
    $trigger_word = strtolower(trim($_POST['form_key']));
    $nation = trim($_POST['form_nation']);
    $tier = intval($_POST['form_tier']);
    $name = trim($_POST['form_name']);
    $mark = intval($_POST['form_mark']);
    $max_dmg = intval($_POST['form_max_dmg']);
    $type = trim($_POST['form_type']);
    $note = trim($_POST['form_note']);
    $max_dmg = empty($max_dmg) ? 0 : $max_dmg;
    db_query_no_result($db, "INSERT INTO tanks (`id`, `trigger_word`, `nation`, `tier`, `name`, `mark`, `max_dmg`, `note`, `type`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", "ssisiiss", [$trigger_word, $nation, $tier, $name, $mark, $max_dmg, $note, $type]);
    exit();
}

function tank_edit(mysqli $db)
{
    $trigger_word = trim($_POST['swal-trigger']);
    $name = trim($_POST['swal-name']);
    $dmg = intval($_POST['swal-dmg']);
    $mark = intval($_POST['swal-mark']);
    $note = trim($_POST['swal-note']);
    db_query_no_result($db, "UPDATE `tanks` SET `trigger_word` = ?, `name` = ?, `mark` = ?, `max_dmg` = ?, `note` = ? WHERE `id` = ?", "ssiisi", [$trigger_word, $name, $mark, $dmg, $note, $_POST['swal-key']]);
    exit();
}

function tank_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM tanks WHERE id= ?", "i", $_POST['id']);
    exit();
}

function nation_add(mysqli $db)
{
    $alias = strtolower(trim($_POST['alias']));
    $nation = $_POST['value'];
    db_query_no_result($db, "REPLACE INTO tanks_nation (`alias`, `nation`) VALUES (?, ?)", "ss", [$alias, $nation]);
    exit();
}

function nation_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM tanks_nation WHERE alias = ?", "s", $_POST['alias']);
    exit();
}

function alias_add(mysqli $db)
{
    $alias = strtolower(trim($_POST['alias']));
    $tank = $_POST['value'];
    db_query_no_result($db, "REPLACE INTO tanks_alias (`alias`, `tank`) VALUES (?, ?)", "ss", [$alias, $tank]);
    exit();
}

function alias_delete(mysqli $db)
{
    db_query_no_result($db, "DELETE FROM tanks_alias WHERE alias = ?", "s", $_POST['alias']);
    exit();
}
