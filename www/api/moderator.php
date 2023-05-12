<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');
require_once('../src/php/functions.php');

header('Content-Type: application/json');

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo json_encode(expression_list($db));
            break;
        }

        if (isset($_GET['list-leet'])) {
            echo json_encode(leet_list($db));
            break;
        }

        if (isset($_GET['list-warning'])) {
            echo json_encode(warn_list($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['check-message'])) {
            echo json_encode(check_message($db, $body["message"]));
            break;
        }

        if (isset($_GET['warn-user'])) {
            echo json_encode(warn_user($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PUT':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['expression'])) {
            echo json_encode(expression_add($db, $body));
            break;
        }

        if (isset($_GET['leet'])) {
            echo json_encode(leet_add($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PATCH':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['expression'])) {
            echo json_encode(expression_edit($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'DELETE':
        if (isset($_GET['expression']) && isset($_GET['id'])) {
            echo json_encode(expression_delete($db, $_GET['id']));
            break;
        }

        if (isset($_GET['leet']) && isset($_GET['id'])) {
            echo json_encode(leet_delete($db, $_GET['id']));
            break;
        }

        if (isset($_GET['warning']) && isset($_GET['id'])) {
            echo json_encode(warn_delete($db, $_GET['id']));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();

function check_message(mysqli $db, $message)
{
    $result = null;

    // Convert array to string
    if (is_array($message))
        $message = implode(" ", $message);

    // Clean up before processing
    $message = unleet($db, trim(strtolower($message)));

    $id_expression = null;
    $action_trigger = false;
    $trigger_data = db_query_raw($db, "SELECT id, trigger_word FROM moderator ORDER BY seriousness DESC");

    while ($row = $trigger_data->fetch_assoc()) {
        $id_expression = $row['id'];

        $pos = strrpos($message, $row['trigger_word']);
        if ($pos !== false) {

            if ($pos > 0)
                $char_before = substr($message, $pos - 1, 1);
            else
                $char_before = '';

            $char_after = substr($message, $pos + strlen($row['trigger_word']), 1);

            if (($char_before == '' || $char_before == ' ') && ($char_after == '' || $char_after == ' '))
                $action_trigger = true;

            break;
        }
    }

    if ($action_trigger) {
        $result = db_query($db, "SELECT * FROM moderator WHERE id = ?", "i", $id_expression);
    }

    if ($result == null)
        return ['mod_action' => null];
    else
        return $result;
}

function warn_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator_warning ORDER BY username ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => $row);
        $count++;
    }

    return $result;
}

function warn_user(mysqli $db, $data)
{
    $datetime = date('Y-m-d H:i:s');

    db_query_no_result(
        $db,
        "INSERT INTO moderator_warning (`id`, `userid`, `username`, `count`, `datetime_insert`, `datetime_update`) VALUES(NULL, ?, ?, 1, ?, ?) ON DUPLICATE KEY UPDATE count = count + 1, datetime_update = ? ",
        "sssss",
        [$data['userid'], $data['username'], $datetime, $datetime, $datetime]
    );

    $warning = db_query($db, "SELECT * FROM moderator_warning WHERE userid = ?", "s", $data['userid']);

    $level = db_query($db, "SELECT * FROM moderator_warning_level WHERE `level` = ?", "i", $warning['count']);

    return ['userid' => $warning['userid'], 'username' => $warning['username'], 'action' => $level['action'], 'duration' => $level['duration'], 'explanation' => $level['explanation'], 'reason' => $level['reason']];
}

function warn_delete(mysqli $db, $id)
{
    db_query_no_result($db, "DELETE FROM `moderator_warning` WHERE `id` = ?", "i", $id);
    log_activity("API", "[MODERATOR-WARNING] Deleted");
    return true;
}

function expression_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator ORDER BY trigger_word ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => $row);
        $count++;
    }

    return $result;
}

function expression_filter_data($data){
    $data['trigger_word'] = trim(strtolower($data['trigger_word']));
    $data['mod_action'] = intval($data['mod_action']);
    $data['explanation'] = trim($data['explanation']);
    $data['duration'] = intval($data['duration']);
    $data['reason'] = trim($data['reason']);
    $data['seriousness'] = intval($data['seriousness']);

    switch($data['mod_action']){
        case 0:
            $data['duration'] = 0;
            $data['seriousness'] = filter_var($data['seriousness'], FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1, 'max_range' => 3]]);
            break;
        
        case 1:
            $data['seriousness'] = filter_var($data['seriousness'], FILTER_VALIDATE_INT, ['options' => ['default' => 4, 'min_range' => 4, 'max_range' => 6]]);
            break;

        case 2:
            $data['duration'] = 0;
            $data['seriousness'] = filter_var($data['seriousness'], FILTER_VALIDATE_INT, ['options' => ['default' => 7, 'min_range' => 7, 'max_range' => 10]]);
            break;

        case 3:
            $data['duration'] = 0;
            $data['explanation'] = "";
            $data['reason'] = "";
            $data['seriousness'] = filter_var($data['seriousness'], FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1, 'max_range' => 3]]);
            break;
    }

    // Max timeout duration possible (limit of Twitch API)
    if ($data['duration'] > 1209600)
        $data['duration'] = 1209600;
    
    return $data;
}

function expression_add(mysqli $db, $data)
{
    $data = expression_filter_data($data);

    db_query_no_result(
        $db,
        "INSERT INTO `moderator` (id, trigger_word, mod_action, explanation, duration, reason, seriousness) VALUES (NULL, ?, ?, ?, ?, ?, ?)",
        "sisisi",
        [$data['trigger_word'], $data['mod_action'], $data['explanation'], $data['duration'], $data['reason'], $data['seriousness']]
    );

    log_activity("API", "[MODERATOR] Added", $data['trigger_word']);
    return true;
}

function expression_edit(mysqli $db, $data)
{
    $data = expression_filter_data($data);

    db_query_no_result(
        $db,
        "UPDATE `moderator` SET `trigger_word` = ?, `mod_action` = ?, `explanation` = ?, `duration` = ?, `reason` = ?, `seriousness` = ? WHERE `id` = ?",
        "sisisii",
        [$data['trigger_word'], $data['mod_action'], $data['explanation'], $data['duration'], $data['reason'], $data['seriousness'], $data['id']]
    );

    log_activity("API", "[MODERATOR] Edited", $data['trigger_word']);
    return true;
}

function expression_delete(mysqli $db, $id)
{
    db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = ?", "i", $id);
    log_activity("API", "[MODERATOR] Deleted");
    return true;
}

function leet_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator_leet ORDER BY replacement ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "replacement" => $row['replacement'], "original" => $row['original']]);
        $count++;
    }

    return $result;
}

function leet_add(mysqli $db, $data)
{
    $original = trim(strtolower($data['original']));
    $replacement = trim(strtolower($data['replacement']));

    db_query_no_result($db, "INSERT INTO `moderator_leet` (id, original, replacement) VALUES (NULL, ?, ?)", "ss", [$original, $replacement]);

    log_activity("API", "[MODERATOR-LEET] Added", $original);
    return true;
}

function leet_delete(mysqli $db, $id)
{
    db_query_no_result($db, "DELETE FROM `moderator_leet` WHERE `id` = ?", "i", $id);
    log_activity("API", "[MODERATOR-LEET] Deleted");
    return true;
}
