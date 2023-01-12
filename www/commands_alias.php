<?php
require_once('src/php/header.php');

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
        <h1 class="page-header">Commands
            <div class='pull-right'>
                <button type="button" class="btn btn-info" onclick='list_alias()'><i class="glyphicon glyphicon-refresh"></i></button>
            </div>
        </h1>

        <ul class="nav nav-tabs">
            <li id="tab-command"><a href="commands.php">Commands</a></li>
            <li id="tab-alias-command"><a href="commands_alias.php">Alias</a></li>
        </ul>

        <!-- Add alias command -->
        <table class="table table-hover table-condensed table-scroll">
            <thead>
                <tr>
                    <th class="col-xs-5">Alias</th>
                    <th class="col-xs-5">Command</th>
                    <th class="table-scroll-th-fix"></th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_alias()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody class="table-scroll-td" id='tbody-list'>
                <!-- Dynamic -->
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("tab-alias-command").classList.add("active");
            document.getElementById("plugin_commands").className = "active";
            list_alias();
        });

        const commands = "<?php echo $command_options; ?>";
    </script>
    <script src="src/js/commands.js"></script>

</body>

</html>