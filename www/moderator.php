<?php
require_once('src/php/header.php');
?>

<!DOCTYPE html>
<html>

<head>
    <title id='bot_name'>Moderator - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Moderator
            <span class='pull-right'>
                <button type="button" class="btn btn-info" id="btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>
            </span>
        </h1>

        <ul class="nav nav-tabs">
            <li id="tab-list"><a href="#" onclick='view("list")'>Expression</a></li>
            <li id="tab-leet"><a href="#" onclick='view("leet")'>Leet</a></li>
        </ul>

        <!-- Add command -->
        <table class="table table-hover table-condensed table-scroll">
            <thead>
                <tr id='th-list' class='hidden'>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-1 text-center">Action</th>
                    <th class="col-xs-2">Reason</th>
                    <th class="col-xs-1 text-center">Duration</th>
                    <th class="col-xs-4">Shaming</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>

                <tr id='th-leet' class='hidden'>
                    <th class="col-xs-5">Replacement</th>
                    <th class="col-xs-5">original</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='addLeet()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody class="table-scroll-td" id='tbody-list'>
                <!-- Dynamic -->
            </tbody>
        </table>
    </div>

    <script src="src/js/common.js"></script>
    <script src="src/js/moderator.js"></script>
    <script src="src/js/moderator-leet.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_moderator").classList.add("active");

            const param_name = getParameterName(0);
            if(param_name)
                view(param_name);
            else
                view('list');
        });
    </script>
    

</body>

</html>