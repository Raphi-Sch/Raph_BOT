<?php
require_once 'src/php/header.php';
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title id='bot_name'>Dock - </title>
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
        <br/>
        <div class="center"><button type='button' class='btn btn-info'  onclick="document.location.href='dashboard.php'">Dashboard</button></div>
    </div>

    <div class='dock-right'>
        <pre id="log" class='log'></pre>
    </div>

    <script>
        $(document).ready(function() {
            connectSocket();
            getLog();
        });
        const is_dashboard = false;
        const is_dock = true;
    </script>
    <script src="src/socket.io-4.6.1/socket.io.js"></script>
    <script src="src/js/common.js"></script>
    <script src="src/js/dashboard.js"></script>

</body>

</html>