<?php
require_once('src/php/header.php');

// POST
if($_SERVER['REQUEST_METHOD'] == 'POST'){
  if($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['mod_action']) && !empty($_POST['explanation'])){
    $trigger_word = strtolower(sanitise_input($db, $_POST['trigger_word']));
    $mod_action = sanitise_input($db, $_POST['mod_action']);
    $explanation = sanitise_input($db, $_POST['explanation']);
    db_query_no_result($db, "INSERT INTO `moderator` VALUES (NULL, '$trigger_word', '$mod_action', '$explanation')");
  }

  if($_POST['action'] == "del" && !empty($_POST['id'])){
    $id = addslashes(trim($_POST['id']));
    db_query_no_result($db, "DELETE FROM `moderator` WHERE `id` = '$id'");
  }

  if($_POST['action'] == "edit" && !empty($_POST['id'])){
    $id = addslashes(trim($_POST['id']));
    $mod_action = addslashes(trim($_POST['mod_action']));
    $explanation = addslashes(trim($_POST['explanation']));
    db_query_no_result($db, "UPDATE `moderator` SET `mod_action` = '$mod_action', `explanation` = '$explanation' WHERE `id` = '$id'");
  }

  header('Location: moderator.php');
  exit();
}


$HTML = "";
$result = db_query_raw($db, "SELECT * FROM `moderator`");
while($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>".$row["trigger_word"]."</td>
        <td id='mod_".$row["id"]."'>".$row["mod_action"]."</td>
        <td id='exp_".$row["id"]."'>".$row["explanation"]."</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"".$row["id"]."\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"".$row['key']."\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`id`) as value FROM `moderator`")['value'];

?>

<!DOCTYPE html>
<html>
  <head>
      <title>Moderator - <?php echo $bot_name; ?></title>
      <?php include("src/html/header.html"); ?>
  </head>

  <body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?> 

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1 class="page-header">Moderator (<?php echo $count;?>)
        <span class='pull-right'>
          <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
        </span>
      </h1>

      <!-- Add command -->
      <table class="table table-hover table-condensed">
        <thead>
          <tr>
              <th class="col-xs-2">Trigger Word</th>
              <th class="col-xs-3">Moderator action</th>
              <th class="col-xs-4">Explanation</th>
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
        document.getElementById("moderator").className="active"; 
      });

      function add_entry(){
        Swal.fire({
            title: "Add entry",
            html:   "<form id='swal-form' method='post'>"+
                    "<input type='hidden' name='action' value='add'>"+
                    "<label>Trigger word</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>"+
                    "<label>Mod action</label><input type='text' class='form-control' name='mod_action' placeholder='Moderator action' required><br/>"+
                    "<label>Explanation</label><input type='text' class='form-control' name='explanation' placeholder='Explanation' required><br/>"+
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

      function del_entry(id){
        Swal({
          title: "Delete '" + id + "' ?",
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          focusCancel: true
        }).then((result) => {
          if (result.value) {
              $.post("moderator.php", { action : "del", id: id }, function(data){
                  document.location.reload();
              }); 
          }
        })
      }

      function edit_entry(id){
        mod = document.getElementById("mod_" + id).innerText;
        exp = document.getElementById("exp_" + id).innerText;
        Swal({
            title: 'Editing : "' + id + '"',
            type: 'info',
            html: "<form id='swal-form' method='post'><br/>"+
                  "<input type='hidden' name='action' value='edit'>"+
                  "<input type='hidden' name='id' value='" + id + "'>"+
                  "<label>Mod action</label><input class='form-control' type='text' name='mod_action' value=\"" + mod + "\"><br/>"+
                  "<label>Explanation</label><input class='form-control' type='text' name='explanation' value=\"" + exp + "\"><br/>"+
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