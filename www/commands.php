<?php
require_once('src/php/header.php');
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title id='bot_name'>Commands - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Commands
            <div class='pull-right'>
                <button type="button" class="btn btn-info" id="btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>
            </div>
        </h1>

        <ul class="nav nav-tabs">
            <li id="tab-text"><a href="#" onclick='view("commands")'>Text</a></li>
            <li id="tab-alias"><a href="#" onclick='view("alias")'>Alias</a></li>
            <li id="tab-audio"><a href="#" onclick='view("audio")'>Audio</a></li>
        </ul>

        <!-- Add command -->
        <table class="table table-hover table-condensed table-scroll">
            <thead>
                <tr id='th-command' class='hidden'>
                    <th class="col-xs-2">Command</th>
                    <th class="col-xs-5">Text</th>
                    <th class="col-xs-1 text-center">Auto</th>
                    <th class="col-xs-1 text-center">Mod Only</th>
                    <th class="col-xs-1 text-center">Sub Only</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>

                <tr id='th-alias' class='hidden'>
                    <th class="col-xs-5">Alias</th>
                    <th class="col-xs-5">Command</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_alias()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>

                <tr id='th-audio' class='hidden'>
                    <th class="col-xs-2">Name</th>
                    <th class="col-xs-1">Trigger</th>
                    <th class="col-xs-1 text-center">Volume</th>
                    <th class="col-xs-1 text-center">Timeout</th>
                    <th class="col-xs-1 text-center">Active</th>
                    <th class="col-xs-1 text-center">Mod Only</th>
                    <th class="col-xs-1 text-center">Sub Only</th>
                    <th class="col-xs-2 text-center">Player</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_audio()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody class="table-scroll-td" id='tbody-list'>
                <!-- Dynamic -->
            </tbody>
        </table>
    </div>

    <?php include("src/php/alert.php"); ?>

    <script src="src/js/common.js"></script>
    <script src="src/js/commands.js"></script>
    <script src="src/js/commands-alias.js"></script>
    <script src="src/js/commands-audio.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_commands").classList.add("active");

            const param_name = get_parameter_name(0);
            if(param_name)
                view(param_name);
            else
                view('commands');
        });
    </script>


</body>

</html>