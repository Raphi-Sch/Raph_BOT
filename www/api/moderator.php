<?php

require_once('../src/php/db.php');
require_once('functions.php');
header('Content-Type: application/json');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo json_encode(get_list($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'];

        if ($data["method"] == "get_moderator") {
            echo json_encode(get_moderator($db, $data["message"]));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_moderator(mysqli $db, $message)
{
    // Initial clean up
    if (is_array($message))
        $words_in = clean_string_in_array($message);

    if (is_string($message))
        $words_in = explode(" ", clean_string($message));

    $SQL_params_type = "";

    // Build word in
    $word_in_count = count($words_in);
    $trigger_word_in = join(',', array_fill(0, $word_in_count, '?'));
    $SQL_params_type .= str_repeat('s', $word_in_count);

    // Build list of all word (in and not in)
    $SQL_values = $words_in;

    $SQL_query = "SELECT mod_action, explanation, duration, reason
        FROM moderator
        WHERE moderator.trigger_word IN (" . $trigger_word_in . ") ORDER BY trigger_word ASC LIMIT 1";

    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_values);

    if ($result == null)
        return ['mod_action' => null, 'explanation' => null, 'duration' => null, 'reason' => null];
    else
        return $result;
}

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM moderator ORDER BY trigger_word ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "trigger_word" => $row['trigger_word'], "mod_action" => $row['mod_action'], "explanation" => $row['explanation'], 'duration' => $row['duration'], 'reason' => $row['reason']]);
        $count++;
    }

    return $result;
}
