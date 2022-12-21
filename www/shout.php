<?php
require_once('src/php/header.php');

$HTML = "";
$result = db_query_raw($db, "SELECT * FROM shout ORDER BY `language` ASC, `type` ASC, original ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>" . $row["original"] . "</td>
        <td id='value_" . $row["id"] . "'>" . $row["replacement"] . "</td>
        <td id='language_" . $row["id"] . "'>" . $row["language"] . "</td>
        <td id='type_" . $row["id"] . "'>" . $row["type"] . "</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"" . $row["id"] . "\", \"" . $row["original"] . "\", \"" . $row["replacement"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row["original"] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

?>

<!DOCTYPE html>
<html>

<head>
    <title>Shout - <?php echo $bot_name; ?></title>
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
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Original</th>
                    <th class="col-xs-2">Replacement</th>
                    <th class="col-xs-2">Language</th>
                    <th class="col-xs-2">Type</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("plugin_shout").classList.add("active");
        });
    </script>
    <script src="src/js/shout.js"></script>

</body>

</html>