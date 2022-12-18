<?php
require_once('src/php/header.php');

$HTML = "";
$result = db_query_raw($db, "SELECT * FROM reactions");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>" . $row["trigger_word"] . "</td>
        <td>" . $row["reaction"] . "</td>
        <td class='text-center'>" . $row["frequency"] . "</td>
        <td class='text-center'>" . $row["timeout"] . "</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"" . $row["id"] . "\", \"" . $row["trigger_word"] . "\", \"" . $row["reaction"] . "\", \"" . $row["frequency"] . "\", \"" . $row["timeout"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row['trigger_word'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

?>

<!DOCTYPE html>
<html>

<head>
    <title>Reactions - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Reactions
            <span class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-6">Reaction</th>
                    <th class="col-xs-1">Frequency (%)</th>
                    <th class="col-xs-1">Timeout (s)</th>
                    <th class="col-xs-2"></th>
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
            document.getElementById("plugin_reaction").classList.add("active");
        });
    </script>
    <script src="src/js/reactions.js"></script>

</body>

</html>