<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');

header('Content-Type: application/json');

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list-tanks'])) {
            echo json_encode(get_list_tanks($db));
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo json_encode(get_list_alias($db));
            break;
        }

        if (isset($_GET['list-nation'])) {
            echo json_encode(get_list_nation($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();

function get_list_tanks(mysqli $db)
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

function get_list_alias(mysqli $db)
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

function get_list_nation(mysqli $db)
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
