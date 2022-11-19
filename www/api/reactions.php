<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if(isset($_GET["request"])){
            get_reaction($db, $_GET['request']);
            break;
        }
        
        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_reaction($db, $request){
    $query = "SELECT reaction, frequency, `timeout`
        FROM reactions
        WHERE reactions.trigger_word = ?";

    $result = db_query($db, $query, "s", $request);
    echo json_encode($result);
    exit();
}