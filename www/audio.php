<?php
require_once('src/php/header.php');
require_once('src/php/functions.php');

$HTML = "";
$result = db_query_raw($db, "SELECT * FROM audio ORDER BY audio.name ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $file = $row["file"];

    $HTML .= "
    <tr>
        <td>" . $row["name"] . "</td>
        <td>" . $row["trigger_word"] . "</td>
        <td>" . ($row["volume"] * 100) . "%</td>
        <td>" . $row["frequency"] . "</td>
        <td>" . $row["timeout"] . "</td>
        <td><audio controls preload=none><source src='src/audio/$file' type='audio/mpeg'></audio></td>
        <td><a href='src/audio/$file'><i class='glyphicon glyphicon-cloud-download'></i> Download</a></td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"" . $row["id"] . "\", \"" . $row["name"] . "\", \"" . $row["trigger_word"] . "\", \"" . $row["volume"] . "\", \"" . $row["frequency"] . "\", \"" . $row["timeout"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row['name'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`id`) as value FROM audio")['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Audio - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Audio (<?php echo $count; ?>)
            <div class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </h1>

        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Name</th>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-1">Volume (%)</th>
                    <th class="col-xs-1">Frequency (%)</th>
                    <th class="col-xs-1">Timeout (s)</th>
                    <th class="col-xs-1"></th>
                    <th class="col-xs-1"></th>
                    <th class="col-xs-1"></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <?php require_once("src/php/alert.php"); ?>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_audio").className += "active";
        });
    </script>
    <script src="src/js/audio.js"></script>

</body>

</html>