<?php
require_once 'src/php/header.php';
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
            <li id="tab-config"><a href="#" onclick='view("config")'>Config</a></li>
        </ul>

        <!-- Main content -->

        <!-- Text -->
        <div id='div-text'>
            <table class="table table-hover table-condensed table-scroll">
                <thead>
                    <tr>
                        <th class="col-xs-2">Command</th>
                        <th class="col-xs-4">Text</th>
                        <th class="col-xs-1 text-center">Auto</th>
                        <th class="col-xs-1 text-center">Mod Only</th>
                        <th class="col-xs-1 text-center">Sub Only</th>
                        <th class="col-xs-1 text-center">TTS</th>
                        <th class="table-scroll-th-fix"></th>
                        <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='commandAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                    </tr>
                </thead>
                <tbody class="table-scroll-td" id='tbody-text'>
                    <!-- Dynamic -->
                </tbody>
            </table>
        </div>

        <!-- Alias -->
        <div id='div-alias'>
            <table class="table table-hover table-condensed table-scroll">
                <thead>
                    <tr>
                        <th class="col-xs-5">Alias</th>
                        <th class="col-xs-5">Command</th>
                        <th class="table-scroll-th-fix"></th>
                        <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='aliasAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                    </tr>
                </thead>
                <tbody class="table-scroll-td" id='tbody-alias'>
                    <!-- Dynamic -->
                </tbody>
            </table>
        </div>

        <!-- Audio -->
        <div id='div-audio'>
            <table class="table table-hover table-condensed table-scroll">
                <thead>
                    <tr>
                        <th class="col-xs-2">Name</th>
                        <th class="col-xs-1">Trigger</th>
                        <th class="col-xs-1 text-center">Volume</th>
                        <th class="col-xs-1 text-center">Timeout</th>
                        <th class="col-xs-1 text-center">Active</th>
                        <th class="col-xs-1 text-center">Mod Only</th>
                        <th class="col-xs-1 text-center">Sub Only</th>
                        <th class="col-xs-2 text-center">Player</th>
                        <th class="table-scroll-th-fix"></th>
                        <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='audioAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                    </tr>
                </thead>
                <tbody class="table-scroll-td" id='tbody-audio'>
                    <!-- Dynamic -->
                </tbody>
            </table>
        </div>

        <!-- Config -->
        <div id='div-config'>
            <br/>     
            <table class="table table-hover table-condensed table-scroll">
                <thead>
                    <tr>
                        <th class="col-xs-2">Key</th>
                        <th class="col-xs-5">Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='tbody-config'>
                    <!-- Dynamic -->
                </tbody>
            </table>

        </div>


    </div>

    <?php include("src/php/alert.php"); ?>

    <script src="src/js/common.js"></script>
    <script src="src/js/commands.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_commands").classList.add("active");

            const param_name = getParameterName(0);
            if (param_name)
                view(param_name);
            else
                view('commands');
        });
    </script>


</body>

</html>