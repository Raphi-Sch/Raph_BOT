<?php
require_once('src/php/db.php');
require_once('src/php/access.php');

global $db;
$db = db_connect();

$bot_name = db_query_prepared($db, "SELECT `value` FROM config WHERE id = 'bot_name'", null, null)["value"];
$port = json_decode(file_get_contents("../config.json"), true)['socket_port'];