<?php
require_once('src/php/header.php');

//POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == "add" && !empty($_POST['alias']) && !empty($_POST['value'])) {
        $alias = strtolower(trim($_POST['alias']));
        $command = trim($_POST['value']);
        db_query_prepared_no_result($db, "REPLACE INTO alias_commands (alias, command) VALUES (?, ?)", "ss", [$alias, $command]);
    }

    if ($_POST['action'] == "del" && !empty($_POST['alias'])) {
        db_query_prepared_no_result($db, "DELETE FROM alias_commands WHERE alias = ?", "s", $_POST['alias']);
    }

    header('Location: alias_commands.php');
    exit();
}

// Listing
$HTML = "";
$data = db_query_raw($db, "SELECT * FROM alias_commands ORDER BY alias_commands.command ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $HTML .= "
  <tr>
      <td>" . $row["alias"] . "</td>
      <td>" . $row["command"] . "</td>
      <td><button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['alias'] . "\")'><i class='glyphicon glyphicon-remove'></i></button></td>
  </tr>";
}

// Building options list
$command_options = "";
$data = db_query_raw($db, "SELECT commands.command FROM commands ORDER BY commands.command ASC");
while ($row = mysqli_fetch_assoc($data)) {
    $command_options .= '<option>' . $row["command"] . '</option>';
}

// Count
$count = db_query_prepared($db, "SELECT COUNT(`alias`) as value FROM alias_commands", null, null)['value'];

?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Alias Commands - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>
    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Alias Commands (<?php echo $count; ?>)
            <div class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-6">Alias</th>
                    <th class="col-xs-6">Command</th>
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
            document.getElementById("alias_commands").className = "active";
        });

        function add_entry() {
            Swal.fire({
                title: "Add entry",
                html: "<form id='swal-form' method='post'>" +
                    "<input type='hidden' name='action' value='add'>" +
                    "<label>Alias</label><input type='text' class='form-control' name='alias' required><br/>" +
                    "<label>Command</label><select class='form-control' name='value' required><option disabled selected> - Select a command - </option><?php echo $command_options; ?></select>" +
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
            Swal({
                title: `Delete '${alias}' ?`,
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                focusCancel: true
            }).then((result) => {
                if (result.value) {
                    $.post("alias_commands.php", {
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