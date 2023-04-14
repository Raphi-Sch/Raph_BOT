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

function request(mysqli $db, $message)
{
    $result = null;

    // Convert array to string
    if (is_array($message))
        $message = implode(" ", $message);

    $message = strtolower($message);

    $SQL_query = "SELECT trigger_word FROM moderator";
    $data = db_query_raw($db, $SQL_query);

    $current_expression = "";
    $action_trigger = false;

    while($row = $data->fetch_assoc()){
        $current_expression = $row['trigger_word'];
        if(strrpos($message, $current_expression) != false){
            $action_trigger = true;
            break;
        }
    }

    if($action_trigger){
        $SQL_query = "SELECT * FROM moderator WHERE trigger_word = ?";
        $SQL_params_type = "s";
        $SQL_values = $current_expression;
        $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_values);
    }

    if ($result == null)
        return ['mod_action' => null, 'explanation' => null, 'duration' => null, 'reason' => null, 'trigger_word' => null];
    else
        return $result;
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
