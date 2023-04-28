<?php

function unauhorized($message = null)
{
    header("HTTP/1.1 401 Unauthorized");
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unauhorized', 'status' => 401, 'message' => $message]);
    exit();
}

$headers = apache_request_headers();

if (!isset($headers['Authorization']) || empty($headers['Authorization'])) {
    unauhorized("Invalid Authorization token");
}

if (!isset($headers['Client']) || empty($headers['Client'])) {
    unauhorized("Invalid client");
}

$data_auth = db_query(
    $db,
    "SELECT token_hash, expiration FROM `authentication` WHERE client = ?",
    "s",
    $headers['Client']
);

if (!password_verify($headers['Authorization'], $data_auth['token_hash'])) {
    unauhorized("Client and Authorization token do not match");
}

if (!empty($data_auth['expiration']) && ($data_auth['expiration'] < date('Y-m-d H:i:s'))){
    unauhorized("Authorization token expired");
}
