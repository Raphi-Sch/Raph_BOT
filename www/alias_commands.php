<?php
require_once('src/php/header.php');

//POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
        $alias = strtolower(trim($_POST['alias']));
        $command = trim($_POST['value']);
        db_query_no_result($db, "REPLACE INTO alias_commands (alias, command) VALUES (?, ?)", "ss", [$alias, $command]);
    }

    if ($_POST['action'] == "del" && !empty($_POST['alias'])) {
        db_query_no_result($db, "DELETE FROM alias_commands WHERE alias = ?", "s", $_POST['alias']);
    }

    header('Location: alias_commands.php');
    exit();
}

// Listing
$HTML = "";
$data = db_query_raw($db, "SELECT * FROM alias_commands ORDER BY alias_commands.command ASC", null, null);
while ($row = mysqli_fetch_assoc($data)) {
    $HTML .= "
  <tr>
      <td>" . $row["alias"] . "</td>
      <td>" . $row["command"] . "</td>
      <td><button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button></td>
  </tr>";
}

// Building options list
$command_options = "";
$data = db_query_raw($db, "SELECT commands.command FROM commands ORDER BY commands.command ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $command_options .= '<option>' . $row["command"] . '</option>';
}

// Count
$count = db_query($db, "SELECT COUNT(`alias`) as value FROM alias_commands", null, null)['value'];

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
        <h1 class="page-header">Alias Commands (<?php echo $count; ?>)
            <div class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Command</th>
                    <th class="col-xs-1"></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <?php include("src/html/footer.html"); ?>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("alias_commands").className = "active";
        });

        const commands = "<?php echo $command_options; ?>";
    </script>
    <script src="src/js/alias_commands.js"></script>

</body>

</html>