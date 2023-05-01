<?php
require_once('src/php/header.php');

$db = db_connect();

$HTML = "";
$data = db_query_raw($db, "SELECT * FROM `activity` ORDER BY `datetime` DESC LIMIT 100");
while ($row = $data->fetch_assoc()) {
    $HTML .= "<tr>
        <td>" . $row['datetime'] . "</td>
        <td>" . $row['user'] . "</td>
        <td>" . $row['note'] . "</td>
    </tr>";
}

?>

<!DOCTYPE html>
<html>

<head>
    <title id='bot_name'>Authentication - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Activity</h1>

        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-1">Datetime</th>
                    <th class="col-xs-1">User</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <?php include("src/php/alert.php"); ?>

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