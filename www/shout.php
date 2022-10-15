<?php
require_once('src/php/header.php');

//POST
if($_SERVER['REQUEST_METHOD'] == 'POST'){
  // Add
  if( $_POST['action'] == "add" && !empty($_POST['original']) && !empty($_POST['replacement'])){
    $original = strtolower(sanitise_input($db, $_POST['original']));
    $replacement = strtolower(sanitise_input($db, $_POST['replacement']));
    db_query_no_result($db, "INSERT INTO shout VALUES ('$original', '$replacement')");
  }

  // Del
  if($_POST['action'] == "del" && !empty($_POST['original'])){
    $original = sanitise_input($db, $_POST['original']);
    db_query_no_result($db, "DELETE FROM shout WHERE original = '$original'");
  }

  // Edit
  if( $_POST['action'] == "edit" && !empty($_POST['original']) && !empty($_POST['replacement'])){
    $original = sanitise_input($db, $_POST['original']);
    $replacement = sanitise_input($db, $_POST['replacement']);
    db_query_no_result($db, "UPDATE `shout` SET `replacement` = '$replacement' WHERE `original` = '$original'");
  }

  header('Location: shout.php');
  exit();
}



$HTML = "";
$result = db_query_raw($db, "SELECT * FROM shout ORDER BY shout.original ASC");
while($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>".$row["original"]."</td>
        <td id='value_".$row["original"]."'>".$row["replacement"]."</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"".$row["original"]."\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"".$row['original']."\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query($db, "SELECT COUNT(`original`) as value FROM shout")['value'];

?>

<!DOCTYPE html>
<html>
  <head>
      <title>Shout - <?php echo $bot_name; ?></title>
      <?php include("src/html/header.html"); ?>
  </head>

  <body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side Navbar -->      
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <h1 class="page-header">Shout (<?php echo $count;?>) 
        <div class='pull-right'>
          <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
        </div>
      </h1>

      <!-- Add command -->
      <table class="table table-hover table-condensed">
        <thead>
            <tr>
                <th class="col-xs-4">Original</th>
                <th class="col-xs-4">Replacement</th>
                <th class="col-xs-4"></th>
            </tr>
          </thead>
        <tbody>
          <?php echo $HTML; ?>
        </tbody>
      </table>
    </div>

    <!-- Placed at the end of the document so the pages load faster -->
    <?php include("src/html/footer.html"); ?>

    <script>
      $(document).ready(function() {
        // Active the corresponding button in the navbar
        document.getElementById("shout").className="active"; 
      });

      function add_entry(){
        Swal.fire({
            title: "Add entry",
            html:   "<form id='swal-form' method='post'>"+
                    "<input type='hidden' name='action' value='add'>"+
                    "<input type='text' class='form-control' name='original' placeholder='Original' required><br/>"+
                    "<input type='text' class='form-control' name='replacement' placeholder='Replacement' required><br/>"+
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

      function del_entry(key){
        Swal({
          title: "Delete '" + key + "' ?",
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          focusCancel: true
        }).then((result) => {
          if (result.value) {
              $.post("shout.php", { action : "del", original: key }, function(data){
                  document.location.reload();
              }); 
          }
        })
      }

      function edit_entry(key){
        value = document.getElementById("value_" + key).innerText;
        Swal({
            title: 'Editing : "' + key + '"',
            type: 'info',
            html: "<form id='swal-form' method='post'><input type='hidden' name='action' value='edit'><input type='hidden' name='original' value='" + key + "'><input class='form-control' type='text' name='replacement' value=\"" + value + "\"></form>",
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

</body>
</html>