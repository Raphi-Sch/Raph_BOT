<?php
require_once 'src/php/header.php';
?>

<!DOCTYPE html>
<html lang="en-GB">

<head>
    <title id='bot_name'>Shout - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Shout
            <div class='pull-right'>
                <button type="button" class="btn btn-info" id="btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>
            </div>
        </h1>

        <ul class="nav nav-tabs">
            <li id="tab-dictionary"><a href="#" onclick='view("dictionary")'>Dictionary</a></li>
            <li id="tab-config"><a href="#" onclick='view("config")'>Config</a></li>
        </ul>

        <!-- Dictionary -->
        <div id='div-dictionary'>
            <table class="table table-hover table-condensed table-scroll">
                <thead>
                    <tr>
                        <th class="col-xs-2">Original</th>
                        <th class="col-xs-2">Replacement</th>
                        <th class="col-xs-2">Language</th>
                        <th class="col-xs-2">Type</th>
                        <th class="table-scroll-th-fix"></th>
                        <th class="col-xs-4"><button type="button" class="btn btn-success pull-right" onclick='dictionaryAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                    </tr>
                </thead>
                <tbody class="table-scroll-td" id='tbody-dictionary'>
                    <!-- Dynamic -->
                </tbody>
            </table>
        </div>

        <!-- Config -->
        <div id='div-config'>
            <br />
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

    <script src="src/js/common.js"></script>
    <script src="src/js/shout.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_shout").classList.add("active");

            const param_name = getParameterName(0);
            if (param_name)
                view(param_name);
            else
                view('dictionary');
        });
    </script>


</body>

</html>