<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

require_once('./tanks.php');

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET['auto_command'])) {
            get_auto_command($db);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data['method'] == "get_command") {
            get_command($db, trim($data['command']), trim($data['param']), $data['excluded_tanks']);
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
function get_command(mysqli $db, string $command, string $param, array $excluded_tanks)
{
    $SQL_query = "SELECT `value` 
        FROM commands LEFT JOIN alias_commands ON alias_commands.command = commands.command
        WHERE alias_commands.alias = ? OR commands.command = ?";

    $result = db_query($db, $SQL_query, "ss", [$command, $command]);

    if ($result['value'] == 'char') {
        $tank_result = run_tank($db, $param, $excluded_tanks);
        $result = $tank_result;
    }

    if (empty($result))
        echo json_encode(['value' => null]);
    else
        echo json_encode($result);

    return null;
}

function get_auto_command(mysqli $db)
{
    $SQL_query = "SELECT command FROM commands WHERE commands.auto = 1";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        array_push($result, $row['command']);
    }

    echo json_encode($result);
    return null;
}
