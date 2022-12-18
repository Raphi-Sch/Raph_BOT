<?php
require_once('src/php/header.php');

// Listing
$HTML = "";
$data = db_query_raw($db, "SELECT * FROM alias_commands ORDER BY alias_commands.command ASC", null, null);
while ($row = mysqli_fetch_assoc($data)) {
    $HTML .= "
  <tr>
      <td>" . $row["alias"] . "</td>
      <td>" . $row["command"] . "</td>
      <td><button type='button' class='btn btn-danger' onclick='del_alias(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button></td>
  </tr>";
}

// Building options list
$command_options = "";
$data = db_query_raw($db, "SELECT commands.command FROM commands ORDER BY commands.command ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $command_options .= '<option>' . $row["command"] . '</option>';
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Alias Commands - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>
    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Commands</h1>

        <ul class="nav nav-tabs">
            <li id="tab-command"><a href="commands.php">Commands</a></li>
            <li id="tab-alias-command"><a href="commands_alias.php">Alias</a></li>
        </ul>

        <!-- Add alias command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Command</th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success" onclick='add_alias()'><i class="glyphicon glyphicon-plus"></i></button></th>
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
            document.getElementById("tab-alias-command").className += "active";
            document.getElementById("plugin_commands").className = "active";
        });

        const commands = "<?php echo $command_options; ?>";
    </script>
    <script src="src/js/commands.js"></script>

</body>

</html>