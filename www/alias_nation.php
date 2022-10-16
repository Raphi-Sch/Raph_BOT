<?php
require_once('src/php/header.php');

//POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
        $alias = strtolower($_POST['alias']);
        $nation = $_POST['value'];
        db_query_prepared_no_result($db, "REPLACE INTO alias_nation VALUES (?, ?)", "ss", [$alias, $nation]);
    }

    if (isset($_POST['action']) && $_POST['action'] == "del") {
        $alias = $_POST['alias'];
        db_query_prepared_no_result($db, "DELETE FROM alias_nation WHERE alias = ?", "s", $alias);
    }

    header('Location: alias_nation.php');
    exit();
}


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
$count = db_query($db, "SELECT COUNT(`alias`) as value FROM alias_nation")['value'];

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

        function add_entry() {
            Swal.fire({
                title: "Add entry",
                html: "<form id='swal-form' method='post'>" +
                    "<input type='hidden' name='action' value='add'>" +
                    "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
                    "<label>Nation</label><select class='form-control' name='value' required>"+
                    "<option selected disabled> - Select a nation - </option>"+
                    "<option>china</option>" +
                    "<option>czechoslovakia</option>"+
                    "<option>france</option>"+
                    "<option>germany</option>" +
                    "<option>italy</option>"+
                    "<option>japan</option>"+
                    "<option>poland</option>"+
                    "<option>sweden</option>"+
                    "<option>uk</option>"+
                    "<option>usa</option>"+
                    "<option>ussr</option></select>" +
                    "</form>",
                showCancelButton: true,
                showConfirmButton: confirm,
                focusConfirm: false,
                allowOutsideClick: false,
                width: "25%",
                confirmButtonText: 'Add',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value)
                    document.getElementById('swal-form').submit();
            });
        }

        function del_entry(alias) {
            Swal.fire({
                title: `Delete '${alias}' ?`,
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                focusCancel: true
            }).then((result) => {
                if (result.value) {
                    $.post("alias_nation.php", {
                        action: "del",
                        alias: alias
                    }, function(data) {
                        document.location.reload();
                    });
                }
            })
        }
    </script>

</body>

</html>