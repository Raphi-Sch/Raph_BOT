<?php

require_once('../src/php/db.php');

$db = db_connect("../../config.json");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo get_list($db);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data["method"] == "get_reaction") {
            echo get_reaction($db, $data["words_in"], $data["words_not_in"]);
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
    $filtered_word_in = array();
    $filtered_word_not_in = array();

    // Filter words
    foreach ($word_in as $word) {
        if (!empty($word)) {
            array_push($filtered_word_in, $word);
        }
    }

    foreach ($word_not_in as $word) {
        if (!empty($word)) {
            array_push($filtered_word_not_in, $word);
        }
    }

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
        return json_encode(['trigger_word' => null, 'reaction' => null, 'frequency' => 0, 'timeout' => 0]);
    else
        return json_encode($result);
}

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM reactions";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($row['id'] => ["trigger_word" => $row['trigger_word'], "reaction" => $row['reaction'], "frequency" => $row['frequency'], "timeout" => $row['timeout']]);
        $count++;
    }

    return json_encode($result);
}