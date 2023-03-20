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

        if ($data["method"] == "get_reaction" && isset($data['words_in'])) {
            $words_in = clean_string_in_array($data['words_in']);
            $words_not_in = isset($data['words_not_in']) ? clean_string_in_array($data['words_not_in']) : array();

            echo json_encode(get_reaction($db, $words_in, $words_not_in));
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
function get_reaction(mysqli $db, array $word_in, array $word_not_in)
{
    $SQL_params_type = "";

    // Build word in
    $word_in_count = count($word_in);
    $trigger_word_in = join(',', array_fill(0, $word_in_count, '?'));
    $SQL_params_type .= str_repeat('s', $word_in_count);

    // Build word not in
    $trigger_word_not_in = "";
    if (count($word_not_in) > 0) {
        $word_not_in_count = count($word_not_in);
        $trigger_word_not_in = " AND reactions.trigger_word NOT IN (" . join(',', array_fill(0, $word_not_in_count, '?')) . ")";
        $SQL_params_type .= str_repeat('s', $word_not_in_count);
    }

    // Build list of all word (in and not in)
    $SQL_values = array_merge($word_in, $word_not_in);

    $SQL_query = "SELECT trigger_word, reaction, frequency, `timeout`
        FROM reactions
        WHERE reactions.trigger_word IN (" . $trigger_word_in . ")" . $trigger_word_not_in . " ORDER BY RAND() LIMIT 1";

    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_values);

    if ($result == null)
        return ['trigger_word' => null, 'reaction' => null, 'frequency' => 0, 'timeout' => 0];
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
        $result += array($count => ["id" => $row['id'], "trigger_word" => $row['trigger_word'], "reaction" => $row['reaction'], "frequency" => $row['frequency'], "timeout" => $row['timeout']]);
        $count++;
    }

    return $result;
}