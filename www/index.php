<?php
session_start();
require_once('src/php/db.php');

global $redirect;
global $JSON_upgrade;

$db = db_connect();
$db_name = json_decode(file_get_contents("../config.json"), true)["db_name"];
$JSON_upgrade = json_decode(file_get_contents("../template/upgrade.json"), true);
$result = "";
$redirect = true;

function fix_column($db, $table_name, $column_name, $column_type)
{
    if (!empty($column_name) && !empty($column_type)) {
        db_query_no_result($db, "ALTER TABLE $table_name ADD $column_name $column_type");
        return "OK";
    }

    return "Not enough data to perform auto-fix";
}

function check_column($db, $db_name, $table_name)
{
    global $JSON_upgrade;
    global $redirect;
    $result = "\n\t- Checking columns :";

    foreach ($JSON_upgrade["table"][$table_name]["fields"] as $field) {
        $field_exist = db_query($db, "SELECT COUNT(*) as exist FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND column_name = ?", "sss", [$db_name, $table_name, $field])['exist'];
        if ($field_exist) {
            $result .= "\n\t\t - $field : OK";
        } else {
            $redirect = false;
            $result .= "\n\t\t - $field : MISSING -> Attempting auto-fix -> " . fix_column($db, $table_name, $field, $JSON_upgrade["table"][$table_name]['types'][$field]);
        }
    }


    return $result;
}

function check_table($db, $db_name, $table)
{
    global $redirect;
    $result = "\nChecking '$table' :";

    $table_exist = mysqli_num_rows(db_query_raw($db, "SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1", "ss", [$db_name, $table]));
    if ($table_exist) {
        $result .= "\n\t- Table state : OK";
        $result .= check_column($db, $db_name, $table);
    } else {
        $redirect = false;
        $result .= "\n\t- Table state : MISSING -> check your configuration and compare it to the provided template";
    }

    return $result;
}

// Main check
foreach ($JSON_upgrade["table"] as $key => $data) {
    $result .= check_table($db, $db_name, $key);
}

if ($redirect) {
    header("Location: login.php");
    exit();
} else {
    $result .= "\n\nPlease check if all tables are set correctly, then refresh this page.\nYou will be automatically redirected to the login page.";
}

?>
<!DOCTYPE html>
<html>

<head>
    <title>Index - Raph_BOT</title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- Main area -->
    <div class="col-md-10 col-md-offset-1 main">
        <h1 class="page-header">Checking Raph_BOT integrity / upgrades</h1>
        <div class="row">
            <div class="col-sm-12">
                <pre class="log"><?php echo $result ?></pre>
            </div>
        </div>
    </div>
</body>

</html>