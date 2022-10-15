<?php
require_once('src/php/header.php');

// POST
if($_SERVER['REQUEST_METHOD'] == 'POST'){
  if($_POST['action'] == "add" && !empty($_POST['command'])){
    $command = strtolower(sanitise_input($db, $_POST['command']));
    $value = sanitise_input($db, $_POST['value']);
    db_query_no_result($db, "INSERT INTO commands VALUES (NULL, '$command', '$value', 0)");
  }

  if($_POST['action'] == "del" && !empty($_POST['id'])){
    $id = sanitise_input($db, $_POST['id']);
    db_query_no_result($db, "DELETE FROM commands WHERE id = '$id'");
  }

  if($_POST['action'] == "edit" && !empty($_POST['id'])){
    $id = sanitise_input($db, $_POST['id']);
    $value = sanitise_input($db, $_POST['value']);
    $auto = isset($_POST['auto']) ? 1 : 0;
    db_query_no_result($db, "UPDATE `commands` SET `value` = '$value', `auto` = '$auto' WHERE id = '$id'");
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
            <button onClick='edit_entry(\"".$row["id"]."\", \"".$row["auto"]."\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
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

      function add_entry(){
        Swal.fire({
            title: "Add entry",
            html:   "<form id='swal-form' method='post'>"+
                    "<input type='hidden' name='action' value='add'>"+
                    "<label>Command</label><input type='text' class='form-control' name='command' placeholder='Command' required><br/>"+
                    "<label>Answer</label><input type='text' class='form-control' name='value' placeholder='Answer' required><br/>"+
                    "</form>",
            showCancelButton: true,
            showConfirmButton: confirm,
            focusConfirm: false,
            allowOutsideClick: false,
            width: "25%",
            confirmButtonText: 'Add',
            cancelButtonText: 'Cancel'
        }).then((result) =>{
            if(result.value)
                document.getElementById('swal-form').submit();
        });
      }

      function del_entry(id, command){
        Swal({
          title: "Delete '" + command + "' ?",
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          focusCancel: true
        }).then((result) => {
          if (result.value) {
              $.post("commands.php", { action : "del", id: id }, function(data){
                  document.location.reload();
              }); 
          }
        })
      }

      function edit_entry(id, auto){
        value = document.getElementById("value_" + id).innerText;

        if(auto == 1)
          checkbox = "checked";
        else
          checkbox = "";

        Swal({
            title: 'Editing : "' + id + '"',
            type: 'info',
            html: "<form id='swal-form' method='post'>"+
                  "<input type='hidden' name='action' value='edit'>"+
                  "<input type='hidden' name='id' value='" + id + "'>"+
                  "<label>Text</label><input class='form-control' type='text' name='value' value=\"" + value + "\">"+
                  "<label>Auto</label><input class='form-control' type='checkbox' name='auto' " + checkbox + ">"+
                  "</form>",
            showCancelButton: true,
            focusConfirm: false,
            allowOutsideClick: false,
            width: "30%",
            confirmButtonText: 'Edit',
            cancelButtonText: 'Cancel'
        }).then((result) =>{
            if(result.value)
                document.getElementById('swal-form').submit();
        })
      }
    </script>

</body></html>