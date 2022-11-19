<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if($data["method"] == "get_reaction"){
            get_reaction($db, $data["word_in"], $data["word_not_in"]);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_reaction($db, $word_in, $word_not_in){
    $params_type = "";

    // Build word in
    $word_in_count = count($word_in);
    $trigger_word_in = join(',', array_fill(0, $word_in_count, '?'));
    $params_type .= str_repeat('s', $word_in_count);
    
    // Build word not in
    if($word_not_in > 0){
        $word_not_in_count = count($word_not_in);
        $trigger_word_not_in = " AND reactions.trigger_word NOT IN (" . join(',', array_fill(0, $word_not_in_count, '?')) . ")";
        $params_type .= str_repeat('s', $word_not_in_count);
    }

    // Build list of all word (in and not in)
    $values = array_merge($word_in, $word_not_in);
    
    $query = "SELECT trigger_word, reaction, frequency, `timeout`
        FROM reactions
        WHERE reactions.trigger_word IN (" . $trigger_word_in . ")" . $trigger_word_not_in . "ORDER BY RAND() LIMIT 1";

    $result = db_query($db, $query, $params_type, $values);

    if($result == null)
        echo json_encode(['trigger_word' => null, 'reaction' => null, 'frequency' => 0, 'timeout' => 0]);
    else
        echo json_encode($result);

    exit();
}