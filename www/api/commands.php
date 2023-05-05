<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');
require_once('../src/php/functions.php');
require_once('./commands/audio.php');
require_once('./commands/tanks.php');
require_once('./commands/tts.php');

header('Content-Type: application/json');

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

        if (isset($_GET['list-tts-config'])) {
            echo json_encode(list_tts_config($db));
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

            echo json_encode(request($db, trim($body['command']), $param, $excluded_tanks, $excluded_audio, $body['timeout_tts']));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PUT':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['command'])) {
            echo json_encode(command_add($db, $body));
            break;
        }

        if (isset($_GET['alias'])) {
            echo json_encode(alias_add($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PATCH':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['audio'])) {
            echo json_encode(audio_edit($db, $body));
            break;
        }

        if (isset($_GET['command'])) {
            echo json_encode(command_edit($db, $body));
            break;
        }

        if (isset($_GET['tts-config'])) {
            echo json_encode(tts_config_edit($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'DELETE':
        if (isset($_GET['audio']) && isset($_GET['id'])) {
            echo json_encode(audio_delete($db, $_GET['id']));
            break;
        }

        if (isset($_GET['command']) && isset($_GET['id'])) {
            echo json_encode(command_delete($db, $_GET['id']));
            break;
        }

        if (isset($_GET['alias']) && isset($_GET['id'])) {
            echo json_encode(alias_delete($db, $_GET['id']));
            break;
        }

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();


function request(mysqli $db, string $command, string $param, array $excluded_tanks, array $excluded_audio, $timeout_tts)
{
    // Check for alias
    $result = db_query($db, "SELECT `command` FROM commands_alias WHERE alias = ?", "s", $command);
    if (!empty($result['command'])) {
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

    // TTS
    if ($command == 'tts') {
        return run_TTS($db, $param, $timeout_tts);
    }

    // Custom commands
    // Query Text
    $result = db_query($db, "SELECT `value`, `mod_only`, `sub_only`, `tts` FROM commands WHERE command = ?", "s", $command);
    if (!empty($result['value'])) {
        if ($result['tts'] == 0)
            return ['response_type' => 'text', 'value' => $result['value'], 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
        else
            return ['response_type' => 'tts', 'value' => $result['value'], 'tts_type' => 'bot', 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
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
        $result[$count] = $row;
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
        $result[$count] = $row;
        $count++;
    }

    return $result;
}

function command_add(mysqli $db, $data)
{
    if (empty($data['command']) || empty($data['text'])) {
        $_SESSION['alert'] = ['error', "Command trigger or text empty", false];
        return false;
    }

    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($data['command'])));
    $text = trim($data['text']);
    $auto = boolval($data['auto']);
    $mod_only = boolval($data['mod_only']) || boolval($data['sub_only']);
    $sub_only = boolval($data['sub_only']);
    $tts = boolval($data['tts']);

    if ($auto)
        $tts = 0;

    db_query_no_result($db, "INSERT INTO commands (`id`, `command`, `value`, `auto`, `mod_only`, `sub_only`, `tts`) VALUES (NULL, ?, ?, ?, ?, ?, ?)", "ssiiii", [$command, $text, $auto, $mod_only, $sub_only, $tts]);

    log_activity("API", "[COMMAND] Added", $command);
    return true;
}

function command_edit(mysqli $db, $data)
{
    $command = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($data['command'])));
    $text = trim($data['text']);
    $auto = boolval($data['auto']);
    $mod_only = boolval($data['mod_only']) || boolval($data['sub_only']);
    $sub_only = boolval($data['sub_only']);
    $tts = boolval($data['tts']);

    if ($auto)
        $tts = 0;

    db_query_no_result(
        $db,
        "UPDATE `commands` SET `command` = ?, `value` = ?, `auto` = ?, `mod_only` = ?, `sub_only` = ?, `tts` = ? WHERE id = ?",
        "ssiiiii",
        [$command, $text, $auto, $mod_only, $sub_only, $tts, $data['id']]
    );

    log_activity("API", "[COMMAND] Edited", $command);
    return true;
}

function command_delete(mysqli $db, $id)
{
    $command = db_query($db, "SELECT command FROM commands WHERE id = ?", "i", $id)['command'];
    db_query_no_result($db, "DELETE FROM commands WHERE id = ?", "i", $id);
    log_activity("API", "[COMMAND] Deleted", $command);
    return true;
}

function alias_add(mysqli $db, $data)
{
    if (empty($data['alias']) || empty($data['command'])) {
        $_SESSION['alert'] = ['error', "Alias or Command empty", false];
        return false;
    }

    $alias = strtolower(trim($data['alias']));
    $command = trim($data['command']);

    db_query_no_result($db, "REPLACE INTO commands_alias (`id`, `alias`, `command`) VALUES (NULL, ?, ?)", "ss", [$alias, $command]);
    log_activity("API", "[COMMAND-ALIAS] Added", $alias);
    return true;
}

function alias_delete(mysqli $db, $id)
{
    $alias = db_query($db, "SELECT alias FROM commands_alias WHERE id = ?", "i", $id)['alias'];
    db_query_no_result($db, "DELETE FROM commands_alias WHERE id = ?", "s", $id);
    log_activity("API", "[COMMAND-ALIAS] Deleted", $alias);
    return true;
}