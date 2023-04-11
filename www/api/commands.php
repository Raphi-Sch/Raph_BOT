<?php

require_once('../src/php/db.php');
require_once('./commands/audio.php');
require_once('./commands/tanks.php');


header('Content-Type: application/json');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list-auto'])) {
            echo json_encode(list_auto($db));
            break;
        }

        if (isset($_GET['list-text'])) {
            echo json_encode(list_text($db));
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo json_encode(list_alias($db));
            break;
        }

        if (isset($_GET['list-audio'])) {
            echo json_encode(list_audio($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['request']) && isset($body['command'])) {
            $param = isset($body['param']) ? trim($body['param']) : "";
            $excluded_tanks = isset($body['excluded_tanks']) ? $body['excluded_tanks'] : array();
            $excluded_audio = isset($body['excluded_audio']) ? $body['excluded_audio'] : array();

            echo json_encode(request($db, trim($body['command']), $param, $excluded_tanks, $excluded_audio));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();


function request(mysqli $db, string $command, string $param, array $excluded_tanks, array $excluded_audio)
{
    // Check for alias
    $result = db_query($db, "SELECT `command` FROM commands_alias WHERE alias = ?", "s", $command);
    if(!empty($result['command'])){
        $command = $result['command'];
    }

    // Built-in commands
    // Tank
    if ($command == 'tank') {
        return run_tank($db, $param, $excluded_tanks);
    }

    // List audio
    if ($command == 'audio') {
        return list_audio_text($db);
    }

    // Custom commands
    // Query Text
    $result = db_query($db, "SELECT * FROM commands  WHERE command = ?", "s", $command);
    if(!empty($result['value'])){
        return ['response_type' => 'text', 'value' => $result['value'], 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
    }

    // Query Audio
    $result = request_audio($db, $command, $excluded_audio);
    if (!empty($result)) {
        return $result;
    }

    // Default
    return ['response_type' => null];
}

function list_auto(mysqli $db)
{
    $SQL_query = "SELECT command FROM commands WHERE commands.auto = 1";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        array_push($result, $row['command']);
    }

    return $result;
}

function list_text(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands ORDER BY command ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "command" => $row['command'], "value" => $row['value'], "auto" => $row['auto'], 'mod_only' => $row['mod_only'], 'sub_only' => $row['sub_only']]);
        $count++;
    }

    return $result;
}

function list_alias(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands_alias ORDER BY command ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "alias" => $row['alias'], "command" => $row['command']]);
        $count++;
    }

    return $result;
}
