<?php
require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');
require_once('../src/php/functions.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['plugin'])) {
            header('Content-Type: application/json');
            echo json_encode(get_plugin($db));
            break;
        }

        if (isset($_GET['name'])) {
            header('Content-Type: application/json');
            echo json_encode(get_name($db));
            break;
        }

        if (isset($_GET['socket-port'])) {
            header('Content-Type: application/json');
            echo json_encode(get_socket_port());
            break;
        }

        if (isset($_GET['log'])) {
            header('Content-Type: text/plain');
            echo get_log();
            break;
        }

        if (isset($_GET['debug'])) {
            header('Content-Type: text/plain');
            echo get_debug();
            break;
        }

        if(isset($_GET['list'])){
            header('Content-Type: application/json');
            echo json_encode(get_config($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PATCH':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if(isset($_GET['edit']) && isset($body['id']) && isset($body['value'])){
            header('Content-Type: application/json');
            echo json_encode(patch_config($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();

function get_plugin(mysqli $db)
{
    $SQL_query = "SELECT * FROM `config` WHERE id LIKE 'plugin_%'";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        $result += array($row['id'] => $row['value']);
    }

    return $result;
}

function get_name(mysqli $db){
    return array("value" => db_query($db, "SELECT `value` FROM config WHERE id = 'bot_name'")["value"]);
}

function get_socket_port(){
    return array("value" => json_decode(file_get_contents("../../config.json"), true)['socket_port']);
}

function get_log(){
    return file_get_contents(dirname(__FILE__) . "/../../core/lastest.log");
}

function get_debug(){
    return file_get_contents(dirname(__FILE__) . "/../../core/debug.log");
}

function get_config(mysqli $db){
    $SQL_query = "SELECT * FROM `config`";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result[$count] = $row;
        $count++;
    }

    return $result;
}

function patch_config(mysqli $db, $body){
    $id = $body['id'];
    $value = $body['value'];

    $previous_value = db_query($db, 'SELECT `value` FROM config WHERE id = ?', "s", $id)['value'];

    db_query_no_result($db, "UPDATE config SET `value` = ? WHERE id = ?", "ss", [$value, $id]);

    log_activity($db, "API", "[CONFIG] Key edited", "$id : $previous_value → $value");

    return ['id' => $id, 'value' => $value];
}