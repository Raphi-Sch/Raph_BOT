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
                <button type="button" class="btn btn-info" onclick='list(true)'><i class="glyphicon glyphicon-refresh"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed table-scroll">
            <thead>
                <tr>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-3">Moderator action</th>
                    <th class="col-xs-4">Explanation</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody class="table-scroll-td" id='tbody-list'>
                <!-- Dynamic -->
            </tbody>
        </table>
    </div>

    <script src="src/js/common.js"></script>
    <script src="src/js/moderator.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_moderator").classList.add("active");
            list();
        });
    </script>
    

</body>

</html>