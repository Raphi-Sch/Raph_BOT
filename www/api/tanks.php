<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET["name"])) {
            get_name($db, $_GET['name']);
            break;
        }

        if (isset($_GET["type"])) {
            get_type($db, $_GET['type']);
            break;
        }

        if (isset($_GET["tier"])) {
            get_tier($db, $_GET['tier']);
            break;
        }

        if (isset($_GET["nation"])) {
            get_nation($db, $_GET['nation']);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


// GET Functions
function get_name($db, $request)
{
    $query = "SELECT DISTINCT `name`, mark, max_dmg, note 
        FROM tanks LEFT JOIN alias_tanks ON alias_tanks.tank = tanks.trigger_word
        WHERE alias_tanks.alias = ? OR tanks.trigger_word = ?";

    $result = db_query($db, $query, "ss", [$request, $request]);
    echo json_encode($result);
    exit();
}

function get_type($db, $request)
{
    $query = "SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks
        WHERE tanks.type = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "s", $request);
    echo json_encode($result);
    exit();
}

function get_tier($db, $request)
{
    $query = "SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks
        WHERE tanks.tier = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "i", $request);
    echo json_encode($result);
    exit();
}

function get_nation($db, $request)
{
    $query = "SELECT tanks.nation as nation, GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks LEFT JOIN alias_nation ON alias_nation.nation = tanks.nation
        WHERE alias_nation.alias = ? OR tanks.nation = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "ss", [$request, $request]);
    echo json_encode($result);
    exit();
}
