<?php
require_once('src/php/header.php');

// Listing
$data = db_query_raw($db, "SELECT * FROM config ORDER BY id");
$list = "";
while ($row = mysqli_fetch_assoc($data)) {
    $HTML_value = "";

    // Type
    switch ($row['type']) {
        default:
        case 0:
            $js_function = "edit_text";
            $HTML_value = $row["value"];
            break;
        case 1:
            $js_function = "edit_bool";
            $HTML_value = $row["value"] ? "Enable" : "Disable"; 
            break;
        case 2:
            $js_function = "edit_number";
            $HTML_value = $row["value"];
            break;
    }

    // Hidden value
    if ($row['hidden']) {
        $HTML_value = "";
        for ($i = 0; $i <= strlen($row['value']); $i++) {
            $HTML_value .= "#";
        }
    }

    $list .= "
    <tr>
        <td>" . $row["id"] . "</td>
        <td id='value_" . $row["id"] . "'>$HTML_value</td>
        <td><button onClick='$js_function(\"" . $row["id"] . "\", \"" . $row["value"] . "\")' class='btn btn-warning pull-right' type='button'><i class='glyphicon glyphicon-pencil'></i></button></td>
    </tr>";
}

$token_id = db_query($db, "SELECT `value` FROM config WHERE id = 'twitch_client_id'")['value'];
$token_scope = db_query($db, "SELECT `value` FROM config WHERE id = 'twitch_scope'")['value'];
$token_return = db_query($db, "SELECT `value` FROM config WHERE id = 'twitch_redirect_uri'")['value'];

$token_URL = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=$token_id&redirect_uri=$token_return&scope=$token_scope";

?>

<!DOCTYPE html>
<html>

<head>
    <title id='bot_name'>Configuration - </title>
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

        <a class='btn btn-info' href="<?php echo $token_URL;?>">Renew Twitch API key</a>

    </div>

    <?php include("src/php/alert.php"); ?>

    <script src="src/js/common.js"></script>
    <script src="src/js/config.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("core").className = "active";
        });

        if(window.location.hash !== ""){
            twitch_token(window.location.hash);
        }

    </script>
    
</body>

</html>