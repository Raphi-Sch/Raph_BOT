<?php

require_once('../src/php/db.php');
require_once('functions.php');
header('Content-Type: application/json');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo json_encode(get_list($db));
            break;
        }

        if (isset($_GET['list-leet'])) {
            echo json_encode(get_list_leet($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['request'])) {
            echo json_encode(request($db, $body["message"]));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator ORDER BY trigger_word ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "trigger_word" => $row['trigger_word'], "mod_action" => $row['mod_action'], 'duration' => $row['duration'], "explanation" => $row['explanation'], 'reason' => $row['reason']]);
        $count++;
    }

    return $result;
}

function get_list_leet(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator_leet ORDER BY replacement ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "replacement" => $row['replacement'], "original" => $row['original']]);
        $count++;
    }

    return $result;
}

function request(mysqli $db, $message)
{
    $result = null;

    // Convert array to string
    if (is_array($message))
        $message = implode(" ", $message);

    // Clean up before processing
    $message = unleet($db, trim(strtolower($message)));

    $current_expression = "";
    $action_trigger = false;
    $trigger_data = db_query_raw($db, "SELECT trigger_word FROM moderator");

    while ($row = $trigger_data->fetch_assoc()) {
        $current_expression = $row['trigger_word'];
        if (strrpos($message, $current_expression) !== false) {
            $action_trigger = true;
            break;
        }
    }

    if ($action_trigger) {
        $result = db_query($db, "SELECT * FROM moderator WHERE trigger_word = ?", "s", $current_expression);
    }

    if ($result == null)
        return ['mod_action' => null, 'explanation' => null, 'duration' => null, 'reason' => null, 'trigger_word' => null];
    else
        return $result;
}
