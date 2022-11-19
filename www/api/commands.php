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
        // Requête invalide
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_command($db, $request){
    $result = db_query($db, "SELECT `value` FROM commands, alias_commands WHERE (alias_commands.command = commands.command AND alias_commands.alias = ?) OR commands.command = ?", "ss", [$request, $request]);
    echo json_encode($result);
    exit();
}