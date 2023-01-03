<?php
require_once('src/php/header.php');

$JSON = json_decode(file_get_contents("../template/update.json"), true);

function fix_config($db, $key, $data)
{
    $result = "";

    $presence = mysqli_num_rows(db_query_raw($db, "SELECT * FROM config WHERE id = ?", "s", $key));

    $result .= "- config, id, $key : " . ($presence ? "OK" : "MISSING");

    if (!$presence) {
        db_query_no_result($db, "INSERT INTO config (id, `value`, `hidden`, `type`) VALUES (?, ?, ?, ?)", "ssii", [$key, $data['value'], $data['hidden'], $data['type']]);

        $repaired = mysqli_num_rows(db_query_raw($db, "SELECT * FROM config WHERE id = ?", "s", $key));
        if ($repaired)
            $result .= " (Repair successful)";
        else
            $result .= " (Repair failed)";
    }

    $result .= "\n";

    return $result;
}

// Checking config entries
$result = "Checking entries\n";

foreach ($JSON as $table_name => $table_data) {
    foreach ($table_data as $key => $data) {
        switch ($table_name) {
            case 'config':
                $result .= fix_config($db, $key, $data);
                break;
            default:
                $result .= "Invalid table name : '$table_name'";
                break;
        }
    }
}

$result .= "\n";

?>

<!DOCTYPE html>
<html>

<head>
    <title>Update - Raph_BOT</title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Update and fix mandatory entries</h1>
        <div class="row">
            <div class="col-sm-12">
                <pre class="log"><?php echo $result ?></pre>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("update").className = "active";
        });
    </script>

</body>

</html>