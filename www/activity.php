<?php
require_once 'src/php/header.php';
?>

<!DOCTYPE html>
<html lang="en-GB">

<head>
    <title id='bot_name'>Authentication - </title>
    <?php include 'src/html/header.html'; ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include 'src/php/navbar.php'; ?>

    <!-- Side Navbar -->
    <?php include 'src/html/sidebar.html'; ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">
            Activity
            <div class='pull-right'>
                <button type="button" class="btn btn-danger" onclick='clearActivity()'><i class="glyphicon glyphicon-erase"></i></button>
            </div>
        </h1>

        <div class="log-activity">
            <pre id="log" class="log"><?php echo file_get_contents(dirname(__FILE__) . "/src/activity.log"); ?></pre>
        </div>
    </div>

    <?php include 'src/php/alert.php'; ?>

    <script src="src/js/common.js"></script>
    <script src="src/js/activity.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("activity").className = "active";
        });
    </script>

</body>

</html>