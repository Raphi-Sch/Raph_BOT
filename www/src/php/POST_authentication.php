<?php

require_once('db.php');
require_once('access.php');
require_once('functions.php');

const USAGE_CORE = 0;
const USAGE_WEBUI = 1;

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    error_post();
    exit();
}

$db = db_connect();

switch ($_POST['action']) {
    case "auth-add":
        echo json_encode(auth_add($db));
        break;

    case "auth-edit":
        auth_edit($db);
        break;

    case "auth-del":
        auth_delete($db);
        break;

    case "auth-renew":
        echo json_encode(auth_renew($db));
        break;

    default:
        exit();
}

exit();

function auth_add($db)
{
    $client = guidv4();

    db_query_no_result(
        $db,
        "INSERT INTO `authentication` (`id`, `client`, `token_hash`, `expiration`, `note`, `usage_type`) VALUES (NULL, ?, '', NULL, NULL, ?)",
        "si",
        [$client, $_POST['usage']]
    );

    log_activity($_SESSION['username'], "[AUTH] Client added", $client);
    return true;
}

function auth_edit($db)
{
    $expiration = (empty($_POST['expiration']) ? NULL : $_POST['expiration']);
    $note = trim($_POST['note']);
    $usage = intval($_POST['usage']);

    db_query_no_result(
        $db,
        "UPDATE `authentication` SET `note` = ?, `expiration` = ?, `usage_type` = ?  WHERE id = ?",
        "ssii",
        [$note, $expiration, $usage, $_POST['id']]
    );

    log_activity($_SESSION['username'], "[AUTH] Client edited", $_POST['client']);
    exit();
}

function auth_delete($db)
{
    db_query_no_result($db, "DELETE FROM `authentication` WHERE id = ?", "i", $_POST['id']);
    log_activity($_SESSION['username'], "[AUTH] Key removed", $_POST['client']);
    exit();
}

function auth_renew($db)
{
    $id = $_POST['id'];
    $token = base64_encode(random_bytes(32));
    $hash = password_hash($token, PASSWORD_BCRYPT);

    db_query_no_result(
        $db,
        "UPDATE `authentication` SET `token_hash` = ? WHERE `authentication`.`id` = ?",
        "ss",
        [$hash, $id]
    );

    // Auto update
    $data_auth = db_query($db, 'SELECT client, usage_type FROM `authentication` WHERE id = ?', 'i', $id);
    $updated = update_config($data_auth['client'], $token, $data_auth['usage_type']);

    log_activity($_SESSION['username'], "[AUTH] Client token renew", $_POST['client']);

    if ($updated)
        log_activity($_SESSION['username'], "[AUTH] Token updated in config file");

    return ['token' => $token, 'file_updated' => $updated];
}

function update_config($client, $token, $usage)
{
    $config = null;

    switch ($usage) {
        case USAGE_CORE:
            $config_path = dirname(__DIR__) . "/../../core/config.json";
            break;

        case USAGE_WEBUI:
            $config_path = dirname(__DIR__) . "/../../config.json";
            break;

        default:
            return false;
    }

    $config = file_get_contents($config_path);
    if ($config === false) {
        return false;
    }

    $config = json_decode($config, true);

    $config['client'] = $client;
    $config['token'] = $token;

    file_put_contents($config_path, json_encode($config, JSON_PRETTY_PRINT));
    return true;
}
