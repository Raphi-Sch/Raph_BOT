<?php
require_once '../src/php/db.php';
require_once '../src/php/auth.php';
require_once '../src/php/functions.php';

const HEADER_JSON = 'Content-Type: application/json';
const HEADER_TEXT = 'Content-Type: text/plain';

$body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['plugin'])) {
            header(HEADER_JSON);
            echo json_encode(get_plugin($db));
            break;
        }

        if (isset($_GET['name'])) {
            header(HEADER_JSON);
            echo json_encode(get_bot_name($db));
            break;
        }

        if (isset($_GET['log'])) {
            header(HEADER_TEXT);
            echo get_log();
            break;
        }

        if (isset($_GET['debug'])) {
            header(HEADER_TEXT);
            echo get_debug();
            break;
        }

        if (isset($_GET['apache2-log'])) {
            header(HEADER_TEXT);
            echo get_apache2_log();
            break;
        }

        if (isset($_GET['list'])) {
            header(HEADER_JSON);
            echo json_encode(get_config($db));
            break;
        }

        http_response_code(400);
        break;

    case 'PATCH':
        if (isset($_GET['edit']) && isset($body['id']) && isset($body['value'])) {
            header(HEADER_JSON);
            echo json_encode(patch_config($db, $body));
            break;
        }

        http_response_code(400);
        break;

    default:
        http_response_code(405);
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

function get_bot_name(mysqli $db)
{
    return array("value" => db_query($db, "SELECT `value` FROM config WHERE id = 'bot_name'")["value"]);
}

function get_log()
{
    return file_get_contents(dirname(__FILE__) . "/../../core/lastest.log");
}

function get_debug()
{
    return file_get_contents(dirname(__FILE__) . "/../../core/debug.log");
}

function get_apache2_log()
{
    return file_get_contents("/var/www/html/logs/raphbot_http_error.log");
}

function get_config(mysqli $db)
{
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

function patch_config(mysqli $db, $body)
{
    $id = $body['id'];
    $value = $body['value'];

    db_query_no_result($db, "UPDATE config SET `value` = ? WHERE id = ?", "ss", [$value, $id]);
    log_activity("API", "[CONFIG] Key edited", "$id");

    return ['id' => $id, 'value' => $value];
}
