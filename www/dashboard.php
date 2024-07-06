<?php
require_once 'src/php/header.php';
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title id='bot_name'>Dashboard - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <div class="col-md-12 row">
            <h1 class="page-header">Dashboard
                <button onclick="startStop()" type="button" class="btn btn-success" id="btn-start-stop"><i id="ico-start-stop" class="glyphicon glyphicon-play"></i></button>
            </h1>
            <div class="col-sm-3">
                <!-- Core Connection -->
                <div class="row">
                    <div class="col-sm-3">Core</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-danger" role="progressbar" style="width:100%" id="core-statut">
                                <span>Disconnected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Twitch Connection -->
                <div class="row">
                    <div class="col-sm-3">Twitch</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-warning" role="progressbar" style="width:100%" id="twitch-statut">
                                <span>Waiting for the core</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-8 col-sm-offset-1">
                <!-- Auto CMD msg progress -->
                <div class="row">
                    <div class="col-sm-2">Message Trigger</div>
                    <div class="col-sm-1" id="auto-cmd-msg-counter">0</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-info" role="progressbar" style="width:0%" id="auto-cmd-msg-bar">
                                <span id="auto-cmd-msg-text"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Auto CMD time progress -->
                <div class="row">
                    <div class="col-sm-2">Time Trigger</div>
                    <div class="col-sm-1" id="auto-cmd-time-counter">0</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-info" role="progressbar" style="width:0%" id="auto-cmd-time-bar">
                                <span id="auto-cmd-time-text"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shout progress -->
                <div class="row">
                    <div class="col-sm-3">Shout Trigger</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-warning" role="progressbar" style="width:0%" id="shout-bar">
                                <span id="shout-text"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Commands Section -->
        <div class="row col-md-12">
            <h2 class="sub-header">Log
                <div class='pull-right'>
                    <button type="button" class="btn btn-info" onclick='getLog()'><i class="glyphicon glyphicon-refresh"></i></button>
                </div>
            </h2>

            <ul class="nav nav-tabs">
                <li id="tab-log"><a href="#" onclick='getLog()'>Log</a></li>
                <li id="tab-debug"><a href="#" onclick='getDebug()'>Debug</a></li>
            </ul>

            <div class="dash-log">
                <pre id="log" class="log"></pre>
            </div>
        </div>

        <!-- Player spawn -->
        <div id='players'></div>

    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("index").className = "active";
            connectSocket();
            getLog();
        });
        const is_dashboard = true;
        const is_dock = false;
    </script>
    <script src="src/vendor/socket.io-4.6.1/socket.io.js"></script>
    <script src="src/js/common.js"></script>
    <script src="src/js/dashboard.js"></script>

</body>

</html>