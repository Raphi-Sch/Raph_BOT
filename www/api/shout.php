<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        get_shout_words($db);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_shout_words($db){
    $query = "SELECT * FROM shout";
    $result = db_query_raw($db, $query);
    $data = array();

    while($row = $result->fetch_assoc()){
        array_push($data, ['original' => $row['original'], 'replacement' => $row['replacement']]);
    }

    echo json_encode($data);
    exit();
}