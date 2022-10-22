<?php
require_once('src/php/header.php');

// POST
if($_SERVER['REQUEST_METHOD'] == 'POST'){
  if($_POST['action'] == "add" && !empty($_POST['command'])){
    $command = strtolower(trim($_POST['command']));
    $text = trim($_POST['text']);
    db_query_no_result($db, "INSERT INTO commands VALUES (NULL, ?, ?, 0)", "ss", [$command, $text]);
  }

  if($_POST['action'] == "del" && !empty($_POST['id'])){
    db_query_no_result($db, "DELETE FROM commands WHERE id = ?", "i", $_POST['id']);
  }

  if($_POST['action'] == "edit" && !empty($_POST['id'])){
    $auto = isset($_POST['auto']) ? 1 : 0;
    $text = trim($_POST['value']);
    db_query_no_result($db, "UPDATE `commands` SET `value` = ?, `auto` = ? WHERE id = ?", "sii", [$text, $auto, $_POST['id']]);
  }

  header('Location: commands.php');
  exit();
}


$HTML = "";
$result = db_query_raw($db, "SELECT * FROM commands");
while($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>".$row["command"]."</td>
        <td id='value_".$row["id"]."'>".$row["value"]."</td>
        <td><input type='checkbox' class='checkbox' ".($row['auto'] ? "checked" : "")." disabled></td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"".$row["id"]."\", \"".$row["auto"]."\",  \"".$row['command']."\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"".$row['id']."\", \"".$row['command']."\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`id`) as value FROM commands")['value'];

?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <title>Commands - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
  </head>

  <body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?> 

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1 class="page-header">Commands (<?php echo $count;?>)
        <div class='pull-right'>
          <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
        </div>
      </h1>

      <!-- Add command -->
      <table class="table table-hover table-condensed">
        <thead>
            <tr>
                <th class="col-xs-2">Command</th>
                <th class="col-xs-8">Text</th>
                <th class="col-xs-1">Auto</th>
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
        document.getElementById("commands").className="active"; 
      });


    </script>
    <script src="src/js/commands.js"></script>

</body></html>