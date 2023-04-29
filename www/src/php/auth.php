<?php

function unauhorized($message = null)
{
    header("HTTP/1.1 401 Unauthorized");
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unauhorized', 'status' => 401, 'message' => $message]);
    exit();
}

if(isset($_COOKIE['raphbot_api_client']) && isset($_COOKIE['raphbot_api_token'])){
    if (empty($_COOKIE['raphbot_api_token'])) {
        unauhorized("Invalid Authorization token");
    }

    if (empty($_COOKIE['raphbot_api_client'])) {
        unauhorized("Invalid client");
    }

    $api_client = $_COOKIE['raphbot_api_client'];
    $api_token = $_COOKIE['raphbot_api_token'];
}
else{
    $headers = apache_request_headers();

    if (!isset($headers['Authorization']) || empty($headers['Authorization'])) {
        unauhorized("Invalid Authorization token");
    }
    
    $headers['Authorization'] = explode(" ", $headers['Authorization'], 2);
    
    if ($headers['Authorization'][0] !== "Bearer"){
        unauhorized("Wrong token type, must be 'Bearer'");
    }
    
    if (!isset($headers['Client']) || empty($headers['Client'])) {
        unauhorized("Invalid client");
    }

    $api_client = $headers['Client'];
    $api_token = $headers['Authorization'][1];
    unset($headers);
}

$data_auth = db_query(
    $db,
    "SELECT token_hash, expiration FROM `authentication` WHERE client = ?",
    "s",
    $api_client
);

if (!password_verify($api_token, $data_auth['token_hash'])) {
    unauhorized("Client and Authorization token do not match");
}

if (!empty($data_auth['expiration']) && ($data_auth['expiration'] < date('Y-m-d H:i:s'))){
    unauhorized("Authorization token expired");
}

unset($api_client, $api_token, $data_auth);