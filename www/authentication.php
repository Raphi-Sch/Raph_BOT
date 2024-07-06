<?php
require_once 'src/php/header.php';

const USAGE_TEXT = ['Core', 'WebUI', 'Other'];

$HTML = "";
$data = db_query_raw($db, "SELECT * FROM `authentication`");
while($row = $data->fetch_assoc()){
    $client = $row['client'];
    $exp = empty($row['expiration']) ? "None" : $row['expiration'];
    $note = $row['note'];
    $usage = USAGE_TEXT[$row['usage_type']];

    $data_renew = ['id' => $row['id'], 'client' => $row['client']];
    $data_edit = ['id' => $row['id'], 'client' => $row['client'], 'expiration' => $row['expiration'], 'note' => $row['note'], 'usage' => $row['usage_type']];
    $data_del = ['id' => $row['id'], 'client' => $row['client']];

    $HTML .= "<tr>
        <td>$client</td>
        <td>$usage</td>
        <td>$exp</td>
        <td>$note</td>
        <td>
            <span class='pull-right'>
                <button class='btn btn-info' onclick='authRenew(`".json_encode($data_renew)."`)'><i class='glyphicon glyphicon-refresh'></i></button>
                <button class='btn btn-warning' onclick='authEdit(`".json_encode($data_edit)."`)'><i class='glyphicon glyphicon-pencil'></i></button>
                <button class='btn btn-danger' onclick='authDelete(`".json_encode($data_del)."`)'><i class='glyphicon glyphicon-remove'></i></button>
            </span>
        </td>
    </tr>";
}

?>

<!DOCTYPE html>
<html lang="en-GB">

<head>
    <title id='bot_name'>Authentication - </title>
    <?php include 'src/html/header.html'; ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include 'src/php/navbar.php'; ?>

    <!-- Side Navbar -->
    <?php include 'src/html/sidebar.html'; ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Authentication</h1>

        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-3">Client</th>
                    <th class="col-xs-1">Usage</th>
                    <th class="col-xs-2">Expiration date</th>
                    <th>Note</th>
                    <th class="col-xs-2"><button type="button" class="btn btn-success pull-right" onclick='authAdd()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <tbody>
                <?php echo $HTML;?>
            </tbody>
        </table>
    </div>

    <?php include 'src/php/alert.php'; ?>

    <script src="src/js/common.js"></script>
    <script src="src/js/authentication.js"></script>
    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("auth").className = "active";
        });
    </script>

</body>

</html>