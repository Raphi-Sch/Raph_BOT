<?php

require_once '../src/php/db.php';
require_once '../src/php/auth.php';
require_once '../src/php/functions.php';

header('Content-Type: application/json');

$body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list-tanks'])) {
            echo json_encode(get_tank($db));
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo json_encode(get_tank_alias($db));
            break;
        }

        if (isset($_GET['list-nation'])) {
            echo json_encode(get_nation_alias($db));
            break;
        }

        http_response_code(400);
        break;

    case 'PUT':
        if (isset($_GET['tank'])) {
            echo json_encode(put_tank($db, $body));
            break;
        }

        if (isset($_GET['nation'])) {
            echo json_encode(put_nation_alias($db, $body));
            break;
        }

        if (isset($_GET['alias'])) {
            echo json_encode(put_tank_alias($db, $body));
            break;
        }

        http_response_code(400);
        break;


    case 'PATCH':
        if (isset($_GET['tank'])) {
            echo json_encode(patch_tank($db, $body));
            break;
        }

        http_response_code(400);
        break;

    case 'DELETE':
        if (isset($_GET['tank']) && isset($_GET['id'])) {
            echo json_encode(delete_tank($db, $_GET['id']));
            break;
        }

        if (isset($_GET['nation']) && isset($_GET['alias'])) {
            echo json_encode(delete_nation_alias($db, $_GET['alias']));
            break;
        }

        if (isset($_GET['alias'])) {
            echo json_encode(delete_tank_alias($db, $_GET['alias']));
            break;
        }

        http_response_code(400);
        break;

    default:
        http_response_code(405);
        break;
}

exit();

function get_tank(mysqli $db)
{
    $SQL_query = "SELECT * FROM tanks ORDER BY `trigger_word` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ['id' => $row['id'], 'trigger_word' => $row['trigger_word'], 'name' => $row['name'], 'nation' => $row['nation'], 'tier' => $row['tier'], 'mark' => $row["mark"], 'max_dmg' =>  $row["max_dmg"], 'type' => $row['type'], 'note' => $row['note']]);
        $count++;
    }

    return $result;
}

function put_tank(mysqli $db, $data)
{
    $trigger_word = strtolower(trim($data['trigger']));
    $nation = trim($data['nation']);
    $tier = intval($data['tier']);
    $name = trim($data['name']);
    $mark = intval($data['mark']);
    $max_dmg = intval($data['max_dmg']);
    $type = trim($data['type']);
    $note = trim($data['note']);

    $max_dmg = empty($max_dmg) ? 0 : $max_dmg;

    db_query_no_result($db, "INSERT INTO tanks (`id`, `trigger_word`, `nation`, `tier`, `name`, `mark`, `max_dmg`, `note`, `type`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", "ssisiiss", [$trigger_word, $nation, $tier, $name, $mark, $max_dmg, $note, $type]);

    log_activity("API", "[TANKS] Added", $name);
    return true;
}

function patch_tank(mysqli $db, $data)
{
    $trigger_word = trim($data['trigger']);
    $name = trim($data['name']);
    $dmg = intval($data['max_dmg']);
    $mark = intval($data['mark']);
    $note = trim($data['note']);

    db_query_no_result($db, "UPDATE `tanks` SET `trigger_word` = ?, `name` = ?, `mark` = ?, `max_dmg` = ?, `note` = ? WHERE `id` = ?", "ssiisi", [$trigger_word, $name, $mark, $dmg, $note, $data['id']]);

    log_activity("API", "[TANKS] Edited", $name);
    return true;
}

function delete_tank(mysqli $db, $id)
{
    db_query_no_result($db, "DELETE FROM tanks WHERE id= ?", "i", $id);
    log_activity("API", "[TANKS] Deleted");
    return true;
}

function get_nation_alias(mysqli $db)
{
    $SQL_query = "SELECT * FROM tanks_nation ORDER BY nation ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ['alias' => $row['alias'], 'nation' => $row['nation']]);
        $count++;
    }

    return $result;
}

function put_nation_alias(mysqli $db, $data)
{
    $alias = strtolower(trim($data['alias']));
    $nation = $data['nation'];
    db_query_no_result($db, "REPLACE INTO tanks_nation (`alias`, `nation`) VALUES (?, ?)", "ss", [$alias, $nation]);
    log_activity("API", "[TANKS-NATION] Added", $alias);
    return true;
}

function delete_nation_alias(mysqli $db, $alias)
{
    db_query_no_result($db, "DELETE FROM tanks_nation WHERE alias = ?", "s", $alias);

    log_activity("API", "[TANKS-NATION] Deleted");
    return true;
}

function get_tank_alias(mysqli $db)
{
    $SQL_query = "SELECT * FROM tanks_alias ORDER BY tank ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ['alias' => $row['alias'], 'tank' => $row['tank']]);
        $count++;
    }

    return $result;
}

function put_tank_alias(mysqli $db, $data)
{
    $alias = strtolower(trim($data['alias']));
    $tank = $data['tank'];
    db_query_no_result($db, "REPLACE INTO tanks_alias (`alias`, `tank`) VALUES (?, ?)", "ss", [$alias, $tank]);

    log_activity("API", "[TANKS-ALIAS] Added", $alias);
    return true;
}

function delete_tank_alias(mysqli $db, $alias)
{
    db_query_no_result($db, "DELETE FROM tanks_alias WHERE alias = ?", "s", $alias);

    log_activity("API", "[TANKS-ALIAS] Deleted");
    return true;
}
