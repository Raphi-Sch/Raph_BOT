<?php
session_start();
require_once('src/php/db.php');

global $can_redirect;
global $JSON;

$redirect = isset($_GET['redirect']) ? trim($_GET['redirect']) : "";

$db = db_connect();
$db_name = json_decode(file_get_contents("../config.json"), true)["db_name"];
$JSON = json_decode(file_get_contents("../template/upgrade.json"), true);
$result = "";
$can_redirect = true;

function column_fix($db, $db_name, $table_name, $column_name, $column_type)
{
    if (!empty($column_name) && !empty($column_type)) {
        db_query_no_result($db, "ALTER TABLE $table_name ADD $column_name $column_type");

        if (column_exist($db, $db_name, $table_name, $column_name))
            return "OK";
        else
            return "Auto-fix failed";
    }

    return "Not enough data to perform auto-fix";
}

function column_exist($db, $db_name, $table_name, $column)
{
    return db_query($db, "SELECT COUNT(*) as exist FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND column_name = ?", "sss", [$db_name, $table_name, $column])['exist'];
}

function check_all_column($db, $db_name, $table_name)
{
    global $JSON;
    global $can_redirect;
    $result = "\n\t- Checking columns :";

    foreach ($JSON["table"][$table_name]["fields"] as $field) {
        if (column_exist($db, $db_name, $table_name, $field)) {
            $result .= "\n\t\t - $field : OK";
        } else {
            $can_redirect = false;
            $result .= "\n\t\t - $field : MISSING -> Attempting auto-fix -> " . column_fix($db, $db_name, $table_name, $field, $JSON["table"][$table_name]['types'][$field]);
        }
    }


    return $result;
}

function check_table($db, $db_name, $table)
{
    global $can_redirect;
    $result = "\nChecking '$table' :";

    $table_exist = mysqli_num_rows(db_query_raw($db, "SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1", "ss", [$db_name, $table]));
    if ($table_exist) {
        $result .= "\n\t- Table state : OK";
        $result .= check_all_column($db, $db_name, $table);
    } else {
        $can_redirect = false;
        $result .= "\n\t- Table state : MISSING -> check your configuration and compare it to the provided template";
    }

    return $result . "\n";
}

function check_config($db, $key, $data)
{
    global $can_redirect;
    $result = "";

    $presence = mysqli_num_rows(db_query_raw($db, "SELECT id FROM config WHERE id = ?", "s", $key));

    $result .= "- config, id ($key) : " . ($presence ? "OK" : "MISSING");

    if (!$presence) {
        $can_redirect = false;

        db_query_no_result($db, "INSERT INTO config (id, `value`, `hidden`, `type`) VALUES (?, ?, ?, ?)", "ssii", [$key, $data['value'], $data['hidden'], $data['type']]);

        $repaired = mysqli_num_rows(db_query_raw($db, "SELECT id FROM config WHERE id = ?", "s", $key));
        if ($repaired) {
            $result .= " (Repair successful)";
            $presence = true;
        } else
            $result .= " (Repair failed)";
    }

    if ($presence && isset($data['help']) && !empty($data['help'])) {
        db_query_no_result($db, "UPDATE `config` SET `help` = ? WHERE `id` = ?", "ss", [$data['help'], $key]);
        $result .= " (Help updated)";
    }

    $result .= "\n";

    return $result;
}

function check_commands_tts_config($db, $key, $data)
{
    global $can_redirect;
    $result = "";

    $presence = mysqli_num_rows(db_query_raw($db, "SELECT id FROM commands_tts_config WHERE id = ?", "s", $key));

    $result .= "- commands_tts_config, id ($key) : " . ($presence ? "OK" : "MISSING");

    if (!$presence) {
        $can_redirect = false;

        db_query_no_result($db, "INSERT INTO commands_tts_config (id, `value`, `type`) VALUES (?, ?, ?)", "ssi", [$key, $data['value'], $data['type']]);

        $repaired = mysqli_num_rows(db_query_raw($db, "SELECT id FROM commands_tts_config WHERE id = ?", "s", $key));
        if ($repaired) {
            $result .= " (Repair successful)";
            $presence = true;
        } else
            $result .= " (Repair failed)";
    }

    $result .= "\n";
    return $result;
}

function check_moderator_warning_level($db, $key, $data)
{
    global $can_redirect;
    $result = "";

    $presence = mysqli_num_rows(db_query_raw($db, "SELECT `level` FROM moderator_warning_level WHERE `level` = ?", "i", $key));

    $result .= "- moderator_warning_level, level $key : " . ($presence ? "OK" : "MISSING");

    if (!$presence) {
        $can_redirect = false;

        db_query_no_result($db, "INSERT INTO moderator_warning_level (`level`, `action`, `duration`, `explanation`, `reason`) VALUES (?, ?, ?, ?, ?)", "iiiss", [$key, $data['action'], $data['duration'], $data['explanation'], $data['reason']]);

        $repaired = mysqli_num_rows(db_query_raw($db, "SELECT `level` FROM moderator_warning_level WHERE `level` = ?", "i", $key));
        if ($repaired) {
            $result .= " (Repair successful)";
            $presence = true;
        } else
            $result .= " (Repair failed)";
    }

    $result .= "\n";
    return $result;
}

// Check Table
foreach ($JSON["table"] as $key => $data) {
    $result .= check_table($db, $db_name, $key);
}

// Check Data
foreach ($JSON['data'] as $table_name => $table_data) {
    $result .= "\n\nChecking data in table '$table_name'\n";

    foreach ($table_data as $key => $data) {
        switch ($table_name) {
            case 'config':
                $result .= check_config($db, $key, $data);
                break;

            case 'commands_tts_config':
                $result .= check_commands_tts_config($db, $key, $data);
                break;

            case 'moderator_warning_level':
                $result .= check_moderator_warning_level($db, $key, $data);
                break;

            default:
                break;
        }
    }
}

$result .= "\n";


if ($can_redirect) {
    header("Location: login.php?redirect=$redirect");
    exit();
} else {
    $result .= "\n\nPlease review this log and check if all tables are set correctly, then refresh this page.\nYou will be automatically redirected to the login page.";
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