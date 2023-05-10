<?php
require_once('access.php');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    error_post();
    exit();
}

if (isset($_POST) && $_POST['action'] == "start") {
    $core_directory = dirname(__DIR__) . "/../../core";
    exec("node $core_directory/core.js > $core_directory/debug.log 2>&1 &");
}

exit();
