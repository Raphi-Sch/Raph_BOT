<?php

require_once '../src/php/db.php';
require_once '../src/php/auth.php';
require_once '../src/php/functions.php';

// Extensions
require_once './commands/audio.php';
require_once './commands/tanks.php';
require_once './commands/tts.php';
require_once './commands/config.php';

header('Content-Type: application/json');

$body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list-auto'])) {
            echo json_encode(command_auto_list($db));
            break;
        }

        if (isset($_GET['list-text'])) {
            echo json_encode(command_list($db));
            break;
        }

        if (isset($_GET['list-alias'])) {
            echo json_encode(alias_list($db));
            break;
        }

        if (isset($_GET['list-audio'])) {
            echo json_encode(audio_list($db));
            break;
        }

        if (isset($_GET['list-config'])) {
            echo json_encode(config_list($db));
            break;
        }

        http_response_code(400);
        break;

    case 'POST':
        if (isset($_GET['request']) && isset($body['command'])) {
            echo json_encode(request($db, $body));
            break;
        }

        http_response_code(400);
        break;

    case 'PUT':
        if (isset($_GET['command'])) {
            echo json_encode(command_add($db, $body));
            break;
        }

        if (isset($_GET['alias'])) {
            echo json_encode(alias_add($db, $body));
            break;
        }

        http_response_code(400);
        break;

    case 'PATCH':
        if (isset($_GET['audio'])) {
            echo json_encode(audio_edit($db, $body));
            break;
        }

        if (isset($_GET['command'])) {
            echo json_encode(command_edit($db, $body));
            break;
        }

        if (isset($_GET['config'])) {
            echo json_encode(config_edit($db, $body));
            break;
        }

        http_response_code(400);
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
        http_response_code(405);
        break;
}

exit();


function request(mysqli $db, $data)
{
    // Preparing input data
    $command = trim($data['command']);
    $data['param'] = trim($data['param']);
    $data['audio_excluded'] = isset($data['audio_excluded']) ? $data['audio_excluded'] : array();
    $data['tanks_excluded'] = isset($data['tanks_excluded']) ? $data['tanks_excluded'] : array();
    
    // Check for alias
    $result = db_query($db, "SELECT `command` FROM commands_alias WHERE alias = ?", "s", $command);
    if (!empty($result['command'])) {
        $command = $result['command'];
    }

    // Built-in commands
    switch($command){
        case 'stop':
            return ['response_type' => 'stop', 'value' => null, 'mod_only' => 1, 'sub_only' => 0];

        case 'github':
            return ['response_type' => 'text', 'value' => "Github repository : https://github.com/Raphi-Sch/Raph_BOT/", 'mod_only' => 0, 'sub_only' => 0];

        case 'tank':
            return tank_run($db, $data);

        case 'audio':
            return audio_list_text($db);

        case 'tts':
            return tts_run($db, $data);
    }

    // Custom commands
    // Query Text
    $result = db_query($db, "SELECT `value`, `mod_only`, `sub_only`, `tts` FROM commands WHERE command = ?", "s", $command);
    if (!empty($result['value'])) {
        if ($result['tts'] == 0){
            return ['response_type' => 'text', 'value' => $result['value'], 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
        }
        else{
            return ['response_type' => 'tts', 'value' => $result['value'], 'tts_type' => 'bot', 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
        }
    }

    // Query Audio
    $result = audio_request($db, $data);
    if (!empty($result)) {
        return $result;
    }

    // Default
    return ['response_type' => null];
}

function command_list(mysqli $db)
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

function command_auto_list(mysqli $db)
{
    $SQL_query = "SELECT command FROM commands WHERE commands.auto = 1";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = $data->fetch_assoc()) {
        array_push($result, $row['command']);
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

function alias_list(mysqli $db)
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