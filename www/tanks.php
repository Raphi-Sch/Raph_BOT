<?php
require_once 'src/php/header.php';
?>

<!DOCTYPE html>
<html lang="en-GB">

<head>
    <title id='bot_name'>Tanks - </title>
    <?php include_once 'src/html/header.html'; ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include_once 'src/php/navbar.php'; ?>

    <!-- Side bar-->
    <?php include_once 'src/html/sidebar.html'; ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Tanks
            <div class='pull-right'>
                <button type="button" class="btn btn-info" id="btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>
            </div>
        </h1>

        <!-- Tabs -->
        <ul class="nav nav-tabs">
            <li id="tab-tanks"><a href="#" onclick='view("tanks")'>Tanks</a></li>
            <li id="tab-alias"><a href="#" onclick='view("alias")'>Alias</a></li>
            <li id="tab-nation"><a href="#" onclick='view("nation")'>Nation</a></li>
        </ul>

        <!-- List -->
        <table class="table table-hover table-condensed table-scroll">
            <thead>
                <tr id='th-tanks' class='hidden'>
                    <th class="col-xs-1">Trigger</th>
                    <th class="col-xs-2">Name</th>
                    <th class="col-xs-1">Nation</th>
                    <th class="col-xs-1">Tier</th>
                    <th class="col-xs-1">Mark</th>
                    <th class="col-xs-1">Damage</th>
                    <th class="col-xs-1">Type</th>
                    <th class="col-xs-3">Note</th>
                    <th class="col-xs-1"><button class="btn btn-success pull-right" onclick='tankAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>

                <tr id='th-alias' class='hidden'>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-5">Tank</th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='aliasAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>

                <tr id='th-nation' class='hidden'>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-5">Nation</th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='nationAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody class="table-scroll-td" id='tbody-list'>
                <!-- Dynamic -->
            </tbody>
        </table>
    </div>

    <script src="src/js/common.js"></script>
    <script src="src/js/tanks.js"></script>
    <script>
        $(document).ready(function() {
            document.getElementById("plugin_tanks").classList.add("active");
            const param_name = getParameterName(0);
            if(param_name)
                view(param_name);
            else
                view('tanks');
        });
    </script>

</body>

</html>