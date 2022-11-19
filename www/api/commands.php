<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if(isset($_GET["request"])){
            get_command($db, $_GET['request']);
            break;
        }
        
        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_command($db, $request){
    $query = "SELECT `value` 
        FROM commands LEFT JOIN alias_commands ON alias_commands.command = commands.command
        WHERE alias_commands.alias = ? OR commands.command = ?";

    $result = db_query($db, $query, "ss", [$request, $request]);

    if($result == null)
        echo json_encode(['value' => null]);
    else
        echo json_encode($result);

    exit();
}