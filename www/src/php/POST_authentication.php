<?php

require_once("./header-post.php");

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
    $token = base64_encode(random_bytes(32));
    $hash = password_hash($token, PASSWORD_BCRYPT);

    db_query_no_result(
        $db,
        "INSERT INTO `authentication` (`id`, `client`, `token_hash`, `expiration`, `note`) VALUES (NULL, ?, ?, NULL, NULL) ",
        "ss",
        [$client, $hash]
    );

    log_activity($db, $_SESSION['username'], "[AUTH] Key added", $client);
    return ['token' => $token];
}

function auth_edit($db)
{
    $expiration = (empty($_POST['expiration']) ? NULL : $_POST['expiration']);
    $note = trim($_POST['note']);

    db_query_no_result(
        $db,
        "UPDATE `authentication` SET `note` = ?, `expiration` = ?  WHERE id = ?",
        "ssi",
        [$note, $expiration, $_POST['id']]
    );

    log_activity($db, $_SESSION['username'], "[AUTH] Key edited", $_POST['client']);
    exit();
}

function auth_delete($db)
{
    db_query_no_result($db, "DELETE FROM `authentication` WHERE id = ?", "i", $_POST['id']);
    log_activity($db, $_SESSION['username'], "[AUTH] Key removed", $_POST['client']);
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

    log_activity($db, $_SESSION['username'], "[AUTH] Key renew", $_POST['client']);
    return ['token' => $token];
}
