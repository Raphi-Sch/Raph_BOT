<?php
require_once('src/php/header.php');

// Listing
$data = db_query_raw($db, "SELECT * FROM config ORDER BY id");
$list = "";
while ($row = mysqli_fetch_assoc($data)) {
    $value = "";
    // Hidden value
    if ($row['hidden']) {
        for ($i = 0; $i <= strlen($row['value']); $i++) {
            $value .= "*";
        }
    } else {
        $value = $row["value"];
    }

    $list .= "
    <tr>
        <td>" . $row["id"] . "</td>
        <td id='value_" . $row["id"] . "'>$value</td>
        <td><button onClick='edit_entry(\"" . $row["id"] . "\", \"" . $row["value"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button></td>
    </tr>";
}


?>

<!DOCTYPE html>
<html>

<head>
    <title>Configuration - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Configuration</h1>

        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Id</th>
                    <th class="col-xs-7">Value</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $list; ?>
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("core").className = "active";
        });
    </script>
    <script src="src/js/config.js"></script>

</body>

</html>