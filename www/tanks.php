<?php
require_once('src/php/header.php');

// List tank
$HTML = "";
$result = db_query_raw($db, "SELECT * FROM tanks ORDER BY `trigger_word` ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
  <tr id='" . $row["id"] . "'>
    <td id='trigger_word'>" . $row["trigger_word"] . "</td>
    <td id='name'>" . $row["name"] . "</td>
    <td id='nation'>" . $row["nation"] . "</td>
    <td id='tier'>" . $row["tier"] . "</td>
    <td id='mark'>" . $row["mark"] . "</td>
    <td id='max_dmg'>" . $row["max_dmg"] . "</td>
    <td id='type'>" . $row["type"] . "</td>
    <td id='note'>" . $row["note"] . "</td>
    <td>
      <span class='pull-right'>
        <button onClick='edit_entry(\"" . $row["id"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
        <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row['name'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
      </span>
    </td>
  </tr>";
}

// Count tank
$count = db_query($db, "SELECT COUNT(`id`) as value FROM tanks")['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Tanks - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Tanks (<?php echo $count; ?>)
            <span class='pull-right'>
                <button class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-1">Trigger</th>
                    <th class="col-xs-2">Name</th>
                    <th class="col-xs-1">Nation</th>
                    <th class="col-xs-1">Tier</th>
                    <th class="col-xs-1">Mark</th>
                    <th class="col-xs-1">Damage</th>
                    <th class="col-xs-1">Type</th>
                    <th class="col-xs-3">Note</th>
                    <th class="col-xs-1"></th>
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
            document.getElementById("tanks").className = "active";
        });
    </script>
    <script src="src/js/tanks.js"></script>

</body>

</html>