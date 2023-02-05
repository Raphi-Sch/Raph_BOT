<?php
require_once('src/php/header.php');

// List
$HTML = "";
$data = db_query_raw($db, "SELECT * FROM tanks_nation ORDER BY nation ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $HTML .= "
  <tr>
      <td>" . $row["alias"] . "</td>
      <td>" . $row["nation"] . "</td>
      <td>
        <span clas='pull-right'>
          <button type='button' class='btn btn-danger' onclick='del_nation(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
        </span>
      </td>
  </tr>";
}

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title id='bot_name'>Alias Nations - </title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Tanks</h1>

        <!-- Tabs -->
        <ul class="nav nav-tabs">
            <li id="tab-tanks"><a href="tanks.php">Tanks</a></li>
            <li id="tab-alias"><a href="tanks_alias.php">Alias</a></li>
            <li id="tab-nation"><a href="tanks_nation.php">Nation</a></li>
        </ul>

        <!-- List -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Nation</th>
                    <th class="col-xs-1"><button type="button" class="btn btn-success pull-right" onclick='add_nation()'><i class="glyphicon glyphicon-plus"></i></button></th>
                </tr>
            </thead>
            <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("tab-nation").classList.add("active");
            document.getElementById("plugin_tanks").classList.add("active");
        });
    </script>
    <script src="src/js/common.js"></script>
    <script src="src/js/tanks.js"></script>

</body>

</html>