<?php
require_once '../src/php/db.php';
require_once '../src/php/functions.php';

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['config'])) {
            header('Content-Type: application/json');
            echo json_encode(get_socket_conf());
            break;
        }

        http_response_code(400);
        break;

    default:
        http_response_code(405);
        break;
}

exit();

function get_socket_conf()
{
    $config = json_decode(file_get_contents("../../core/config.json"), true);
    return ["port" => $config['socket_port'], "protocol" => $config['socket_protocol']];
}
