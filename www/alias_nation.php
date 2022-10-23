<?php
require_once('src/php/header.php');

// List
$HTML = "";
$data = db_query_raw($db, "SELECT * FROM alias_nation ORDER BY alias_nation.nation ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $HTML .= "
  <tr>
      <td>" . $row["alias"] . "</td>
      <td>" . $row["nation"] . "</td>
      <td>
        <span clas='pull-right'>
          <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
        </span>
      </td>
  </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`alias`) as value FROM alias_nation", null, null)['value'];

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Alias Nations - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Alias Nations (<?php echo $count; ?>)
            <span class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Nation</th>
                    <th class="col-xs-1"></th>
                </tr>
            </thead>
            <?php echo $HTML; ?>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <?php include("src/html/footer.html"); ?>

    <script>
        $(document).ready(function() {
            // Active the corresponding button in the navbar
            document.getElementById("alias_nation").className = "active";
        });

    </script>
    <script src="src/js/alias_nation.js"></script>

</body>

</html>