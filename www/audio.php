<?php
require_once('src/php/header.php');
require_once('src/php/functions.php');

//POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Add
    if ($_POST['action'] == "add" && !empty($_POST['name']) && !empty($_POST['trigger'])) {
        $name = trim($_POST['name']);
        $trigger = trim($_POST['trigger']);
        $volume = floatval($_POST['volume']);
        $freq = intval($_POST['freq']);
        $timeout = intval($_POST['timeout']);
        $file_name = file_upload("audio", dirname(__FILE__) . "/src/audio", "", false, guidv4());

        if ($file_name) {
            db_query_no_result($db, "INSERT INTO audio VALUES (NULL, ?, ?, ?, ?, ?, ?)", "sssdii", [$name, $trigger, $file_name, $volume, $timeout, $freq]);
        }

        header('Location: audio.php');
        exit();
    }

    // Del
    if ($_POST['action'] == "del" && !empty($_POST['id'])) {
        $id = $_POST['id'];

        // Get filename
        $file = db_query($db, "SELECT `file` FROM audio WHERE id = ?", "i", $id)['file'];

        // Remove file
        shell_exec("rm src/audio/$file");

        // Remove from database
        db_query_no_result($db, "DELETE FROM audio WHERE id = ?", "i", $id);

        exit();
    }

    if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $trigger = $_POST['trigger'];
        $volume = floatval($_POST['volume']);
        $freq = intval($_POST['freq']);
        $timeout = intval($_POST['timeout']);

        db_query_no_result($db, "UPDATE `audio` SET `name` = ?, `trigger_word` = ?, `volume` = ?, `frequency` = ?, `timeout` = ? WHERE id = ?", "ssdiii", [$name, $trigger, $volume, $freq, $timeout, $id]);

        header('Location: audio.php');
        exit();
    }

    exit();
}

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
    <?php
    require_once("src/html/footer.html");
    require_once("src/php/alert.php");
    ?>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("audio").className = "active";
        });
    </script>
    <script src="src/js/audio.js"></script>

</body>

</html>