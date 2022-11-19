<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if(isset($_GET["request"])){
            get_moderator($db, $_GET['request']);
            break;
        }
        
        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_moderator($db, $request){
    $query = "SELECT mod_action, explanation
        FROM moderator
        WHERE moderator.trigger_word = ?" ;

    $result = db_query($db, $query, "s", $request);

    if($result == null)
        echo json_encode(['mod_action' => null, 'explanation' => null]);
    else
        echo json_encode($result);

    exit();
}