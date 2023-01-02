<?php

require_once('../src/php/db.php');
require_once('./tanks.php');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['auto'])) {
            echo get_auto($db);
            break;
        }

        if (isset($_GET['list'])) {
            echo get_list($db);
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo get_list_alias($db);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data['method'] == "get_command") {
            echo get_command($db, trim($data['command']), trim($data['param']), $data['excluded_tanks']);
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
        $result = run_tank($db, $param, $excluded_tanks);
    }

    if (empty($result))
        return json_encode(['value' => null]);
    else
        return json_encode($result);
}

function get_auto(mysqli $db)
{
    $SQL_query = "SELECT command FROM commands WHERE commands.auto = 1";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        array_push($result, $row['command']);
    }

    return json_encode($result);
}

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands ORDER BY command ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "command" => $row['command'], "value" => $row['value'], "auto" => $row['auto']]);
        $count++;
    }

    return json_encode($result);
}

function get_list_alias(mysqli $db)
{
    $SQL_query = "SELECT * FROM alias_commands ORDER BY command ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($row['alias'] => $row['command']);
        $count++;
    }

    return json_encode($result);
}
