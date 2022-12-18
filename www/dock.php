<?php
require_once('src/php/header.php');
$lastestlog = shell_exec('cat ' . dirname(__FILE__) . "/../core/" . 'lastest.log');
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Dock - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body class="dock">
    <div class='dock-left'>
        <table>
            <tr>
                <th>Core</th>
                <td><i class='glyphicon glyphicon-off ico-red' id='dock-core-statut'></i></td>
            </tr>
            <tr>
                <th>Twitch</th>
                <td><i class='glyphicon glyphicon-hourglass ico-orange' id='dock-twitch-statut'></i></td>
            </tr>
            <tr>
                <th>Message</th>
                <td><span id="dock-msg-text">0 / 0</span></td>
            </tr>
            <tr>
                <th>Time</th>
                <td><span id="dock-time-text">0 / 0</span></td>
            </tr>
            <tr>
                <th>Shout</th>
                <td><span id="dock-shout-text">0 / 0</span></td>
            </tr>
        </table>
    </div>

    <div class='dock-right'>
        <pre id="log" class='log'><?php echo $lastestlog ?></pre>
    </div>

    <script>
        $(document).ready(function() {
            connect_socket();
        });
        const is_dashboard = false;
        const is_dock = true;
    </script>

    <script src="src/js/socket.io.js"></script>
    <script src="src/js/socket-handler.js"></script>

</body>

</html>