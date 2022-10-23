<?php

require_once('db.php');
require_once('access.php');
require_once('functions.php');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    error_post();
    exit();
}

$db = db_connect(true);