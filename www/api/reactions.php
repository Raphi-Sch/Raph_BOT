<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');
require_once('../src/php/functions.php');
require_once('functions.php');

header('Content-Type: application/json');

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo json_encode(get_list($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['request']) && isset($body['message'])) {
            $exclusion = isset($body['exclusion']) ? $body['exclusion'] : array();

            if (!is_string($body['message']) || !is_array($exclusion)) {
                header("HTTP/1.0 400 Bad request");
                break;
            }

            echo json_encode(request($db, $body['message'], $exclusion));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;


    case 'PUT':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($body['trigger'])) {
            header('Content-Type: application/json');
            echo json_encode(add($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PATCH':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($body['id'])) {
            header('Content-Type: application/json');
            echo json_encode(edit($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            echo json_encode(delete($db, $_GET['id']));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();


function request(mysqli $db, $message, $exclusion)
{
    // Initial clean up
    $message = unleet($db, $message);
    $words_in = explode(" ", clean_string($message));
    $words_not_in = clean_string_in_array($exclusion);

    // No words in left
    if (empty($words_in)) {
        return ['trigger_word' => null, 'reaction' => null, 'frequency' => 0, 'timeout' => 0];
    }

    $SQL_params_type = "";

    // Build word in
    $word_in_count = count($words_in);
    $trigger_word_in = join(',', array_fill(0, $word_in_count, '?'));
    $SQL_params_type .= str_repeat('s', $word_in_count);

    // Build word not in
    $trigger_word_not_in = "";
    if (count($words_not_in) > 0) {
        $word_not_in_count = count($words_not_in);
        $trigger_word_not_in = " AND reactions.trigger_word NOT IN (" . join(',', array_fill(0, $word_not_in_count, '?')) . ")";
        $SQL_params_type .= str_repeat('s', $word_not_in_count);
    }

    // Build list of all word (in and not in)
    $SQL_values = array_merge($words_in, $words_not_in);

    $SQL_query = "SELECT trigger_word, reaction, frequency, `timeout`, tts
        FROM reactions
        WHERE reactions.trigger_word IN (" . $trigger_word_in . ")" . $trigger_word_not_in . " ORDER BY RAND() LIMIT 1";

    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_values);

    if ($result == null)
        return ['trigger_word' => null, 'reaction' => null, 'frequency' => 0, 'timeout' => 0, 'tts' => 0];
    else
        return $result;
}

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM reactions ORDER BY trigger_word ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "trigger_word" => $row['trigger_word'], "reaction" => $row['reaction'], "frequency" => $row['frequency'], "timeout" => $row['timeout'], "tts" => $row['tts']]);
        $count++;
    }

    return $result;
}

function add(mysqli $db, $data)
{
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($data['trigger'])));
    $reaction = trim($data['reaction']);
    $frequency = intval($data['frequency']);
    $timeout = intval($data['timeout']);
    $tts = intval($data['tts']);

    log_activity($db, "API", "[REACTION] Created", $trigger);

    db_query_no_result($db, "INSERT INTO reactions (`id`, `trigger_word`, `reaction`, `frequency`, `timeout`, `tts`) VALUES (NULL, ?, ?, ?, ?, ?)", "ssiii", [$trigger, $reaction, $frequency, $timeout, $tts]);
    return true;
}

function edit(mysqli $db, $data)
{
    $trigger = preg_replace("/[^a-z0-9]+/", "", trim(strtolower($data['trigger'])));
    $reaction = trim($data['reaction']);
    $frequency = intval($data['frequency']);
    $timeout = intval($data['timeout']);
    $tts = intval($data['tts']);

    log_activity($db, "API", "[REACTION] Edited", $trigger);

    db_query_no_result($db, "UPDATE `reactions` SET `trigger_word` = ?, `reaction` = ?, `frequency` = ?, `timeout` = ?, `tts` = ? WHERE `id` = ?", "ssiiii", [$trigger, $reaction, $frequency, $timeout, $tts, $data['id']]);
    return true;
}

function delete(mysqli $db, int $id)
{
    $trigger = db_query($db, 'SELECT `trigger_word` FROM `reactions` WHERE id = ?', "s", $id)['trigger_word'];
    log_activity($db, "API", "[REACTION] Deleted", $trigger);
    
    db_query_no_result($db, "DELETE FROM `reactions` WHERE `id` = ?", "i", $id);
    return true;
}
