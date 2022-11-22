<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if($data["method"] == "get_moderator"){
            get_moderator($db, $data["words"]);
            break;
        }
        
        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
/*
function get_moderator(mysqli $db, array $words){
    $query = "SELECT mod_action, explanation
        FROM moderator
        WHERE moderator.trigger_word = ?" ;

    $result = db_query($db, $query, "s", $request);

    if($result == null)
        echo json_encode(['mod_action' => null, 'explanation' => null]);
    else
        echo json_encode($result);

    exit();
}*/

function get_moderator(mysqli $db, array $word_in){
    $SQL_params_type = "";
    $filtered_word_in = array();

    // Filter words
    foreach($word_in as $word){
        if(!empty($word)){
            array_push($filtered_word_in, $word);
        }
    }

    // Build word in
    $word_in_count = count($word_in);
    $trigger_word_in = join(',', array_fill(0, $word_in_count, '?'));
    $SQL_params_type .= str_repeat('s', $word_in_count);

    // Build list of all word (in and not in)
    $SQL_values = $word_in;
    
    $SQL_query = "SELECT mod_action, explanation
        FROM moderator
        WHERE moderator.trigger_word IN (" . $trigger_word_in . ") ORDER BY trigger_word ASC LIMIT 1";

    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_values);

    if($result == null)
        echo json_encode(['mod_action' => null, 'explanation' => null]);
    else
        echo json_encode($result);

    return null;
}