<?php
require_once('src/php/header.php');

// POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['mod_action']) && !empty($_POST['explanation'])) {
        $trigger = trim($_POST['trigger_word']);
        $mod_action = trim($_POST['mod_action']);
        $explanation = trim($_POST['explanation']);
        db_query_no_result($db, "INSERT INTO `moderator` (id, trigger_word, mod_action, explanation) VALUES (NULL, ?, ?, ?)", "sss", [$trigger, $mod_action, $explanation]);
    }

    if ($_POST['action'] == "del" && !empty($_POST['id'])) {
        db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = ?", "i", $_POST['id']);
    }

    if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
        $mod_action = trim($_POST['mod_action']);
        $explanation = trim($_POST['explanation']);
        db_query_no_result($db, "UPDATE `moderator` SET `mod_action` = ?, `explanation` = ? WHERE `id` = ?", "ssi", [$mod_action, $explanation, $_POST['id']]);
    }

    header('Location: moderator.php');
    exit();
}


$HTML = "";
$result = db_query_raw($db, "SELECT * FROM `moderator`");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>" . $row["trigger_word"] . "</td>
        <td id='mod_" . $row["id"] . "'>" . $row["mod_action"] . "</td>
        <td id='exp_" . $row["id"] . "'>" . $row["explanation"] . "</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"" . $row["id"] . "\", \"" . $row["trigger_word"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row['trigger_word'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`id`) as value FROM `moderator`")['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Moderator - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Moderator (<?php echo $count; ?>)
            <span class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-3">Moderator action</th>
                    <th class="col-xs-4">Explanation</th>
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
            document.getElementById("moderator").className = "active";
        });
    </script>
    <script src="src/js/moderator.js"></script>

</body>

</html>