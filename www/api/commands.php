<?php

require_once('../src/php/db.php');
require_once('./tanks.php');
header('Content-Type: application/json');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['auto'])) {
            echo json_encode(get_auto($db));
            break;
        }

        if (isset($_GET['list'])) {
            echo json_encode(get_list($db));
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo json_encode(get_list_alias($db));
            break;
        }

        if (isset($_GET['list-audio'])) {
            echo json_encode(get_list_audio($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data['method'] == "get_command") {
            echo json_encode(get_command($db, trim($data['command']), trim($data['param']), $data['excluded_tanks'], $data['excluded_audio']));
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
function get_command(mysqli $db, string $command, string $param, array $excluded_tanks, array $excluded_audio)
{
    // Check for alias
    $result = db_query($db, "SELECT `command` FROM alias_commands WHERE alias = ?", "s", $command);
    if(!empty($result['command'])){
        $command = $result['command'];
    }

    // Query Text
    $result = db_query($db, "SELECT `value` FROM commands  WHERE command = ?", "s", $command);
    if(!empty($result['value'])){
        return ['response_type' => 'text', 'value' => $result['value']];
    }

    // Query Tank
    if ($command == 'tank') {
        return run_tank($db, $param, $excluded_tanks);
    }

    // Query Audio
    $result = run_audio($db, $command, $excluded_audio);
    if (!empty($result)) {
        return $result;
    }

    // Default
    return ['value' => null];
}

function get_auto(mysqli $db)
{
    $SQL_query = "SELECT command FROM commands WHERE commands.auto = 1";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        array_push($result, $row['command']);
    }

    return $result;
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

    return $result;
}

function get_list_alias(mysqli $db)
{
    $SQL_query = "SELECT * FROM alias_commands ORDER BY command ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["alias" => $row['alias'], "command" => $row['command']]);
        $count++;
    }

    return $result;
}

function get_list_audio(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands_audio ORDER BY 'name' ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = mysqli_fetch_assoc($data)) {
        $result += array($count => ["id" => $row['id'], "name" => $row["name"], "trigger_word" => $row["trigger_word"], "volume" => $row["volume"], "timeout" => $row["timeout"], "file" => $row['file'], "active" => $row['active']]);
        $count++;
    }

    return $result;
}

function run_audio(mysqli $db, string $command, array $excluded_audio)
{
    $SQL_params_type = "";
    $SQL_params = array();
    $trigger_word_not_in = "";

    // Command
    $SQL_params_type .= "s";
    array_push($SQL_params, $command);

    // Build audio not in
    if (count($excluded_audio) > 0) {
        $excluded_audio_count = count($excluded_audio);
        $trigger_word_not_in = " AND trigger_word NOT IN (" . join(',', array_fill(0, $excluded_audio_count, '?')) . ")";
        $SQL_params_type .= str_repeat('s', $excluded_audio_count);
        $SQL_params = array_merge($SQL_params, $excluded_audio);
    }

    $SQL_query = "SELECT * FROM commands_audio WHERE trigger_word = ? AND active = 1 $trigger_word_not_in";
    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_params);

    if ($result == null)
        return null;
    else
        return ['response_type' => 'audio', "id" => $result['id'], 'trigger_word' => $result['trigger_word'], 'timeout' => $result['timeout'], 'file' => $result['file'], 'name' => $result['name'], 'volume' => $result['volume']];
}
