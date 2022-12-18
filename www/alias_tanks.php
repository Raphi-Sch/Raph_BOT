<?php
require_once('src/php/header.php');

// List option
$result = db_query_raw($db, "SELECT trigger_word, `name` FROM tanks ORDER BY `name` ASC");
$options_tanks = "";
while ($row = mysqli_fetch_assoc($result)) {
    $options_tanks .= "<option value='" . $row["trigger_word"] . "'>" . $row["name"] . "</option>";
}

// List alias
$result = db_query_raw($db, "SELECT * FROM alias_tanks ORDER BY alias_tanks.tank ASC");
$alias = "";
while ($row = mysqli_fetch_assoc($result)) {
    $alias .= "
    <tr>
        <td>" . $row["alias"] . "</td>
        <td>" . $row["tank"] . "</td>
        <td><button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button></td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`alias`) as value FROM alias_tanks")['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Alias Tanks - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Alias Tanks (<?php echo $count; ?>)
            <span class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Tank</th>
                    <th class="col-xs-1"></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $alias; ?>
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("alias_tanks").className = "active";
        });

        const tanks = "<?php echo $options_tanks; ?>";
    </script>
    <script src="src/js/alias_tanks.js"></script>

</body>

</html>