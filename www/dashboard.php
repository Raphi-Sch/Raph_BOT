<?php
require_once('src/php/header.php');

$lastestlog = shell_exec('cat ' . dirname(__FILE__) . "/../core/" . 'lastest.log');

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Dashboard - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Dashboard
            <button onclick="start_stop()" type="button" class="btn btn-success" id="btn-start-stop"><i id="ico-start-stop" class="glyphicon glyphicon-play"></i></button>
            <button onclick="annonce()" type="button" class="btn btn-info" id="btn-annonce" style='display:none'><i id="ico-start-stop" class="glyphicon glyphicon-send"></i></button>
        </h1>

        <div class="row">
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

                <!-- Discord Connexion -->
                <div class="row">
                    <div class="col-sm-3">Discord</div>
                    <div class="col-sm-9">
                        <div class="progress">
                            <div class="progress-bar progress-bar-warning" role="progressbar" style="width:100%" id="discord-statut">
                                <span>Waiting for the core</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Audio -->
                <div class="row">
                    <div class="col-sm-3">Audio</div>
                    <div class="col-sm-9">
                        <!-- Audio player -->
                        <audio id='player' preload=none controls>
                            <source src='' type='audio/mpeg'>
                        </audio>
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
        <h2 class="sub-header">Log</h2>
        <div class="row">
            <div class="col-sm-12 dash-log">
                <pre id="log" class="log"><?php echo $lastestlog ?></pre>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <?php include("src/html/footer.html"); ?>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("index").className = "active";
        });
        const port = parseInt("<?php echo $port; ?>");
        const is_dashboard = true;
        const is_dock = false;
    </script>
    <script src="src/js/socket.io.js"></script>
    <script src="src/js/socket-handler.js"></script>
    
</body>

</html>