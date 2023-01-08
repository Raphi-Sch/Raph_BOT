<?php
require_once('../src/php/db.php');
header('Content-Type: application/json');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['plugin'])) {
            echo json_encode(get_plugin($db));
            break;
        }

        if (isset($_GET['name'])) {
            echo json_encode(get_name($db));
            break;
        }

        if (isset($_GET['socket-port'])) {
            echo json_encode(get_socket_port());
            break;
        }

        if (isset($_GET['log'])) {
            echo get_log();
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();

// GET Functions
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
    return shell_exec('cat ' . dirname(__FILE__) . "/../../core/" . 'lastest.log');
}