<?php
require_once('src/php/header.php');

// POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == "add" && !empty($_POST['trigger_word']) && !empty($_POST['reaction'])) {
        $trigger_word = strtolower(trim($_POST['trigger_word']));
        $reaction = trim($_POST['reaction']);
        $frequency = intval($_POST['frequency']);
        $timeout = intval($_POST['timeout']);
        db_query_prepared_no_result($db, "INSERT INTO reactions VALUES (NULL, ?, ?, ?, ?)", "ssii", [$trigger_word, $reaction, $frequency, $timeout]);
    }

    if ($_POST['action'] == "del" && !empty($_POST['id'])) {
        db_query_prepared_no_result($db, "DELETE FROM `reactions` WHERE `id` = ?", "i", $_POST['id']);
    }

    if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
        $reaction = trim($_POST['value']);
        $frequency = intval($_POST['frequency']);
        $timeout = intval($_POST['timeout']);
        db_query_prepared_no_result($db, "UPDATE `reactions` SET `reaction` = ?, `frequency` = ?, `timeout` = ? WHERE `id` = ?", "siii", [$reaction, $frequency, $timeout, $_POST['id']]);
    }

    header('Location: reactions.php');
    exit();
}


$HTML = "";
$result = db_query_raw($db, "SELECT * FROM reactions");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
    <tr>
        <td>" . $row["trigger_word"] . "</td>
        <td id='text_" . $row["id"] . "'>" . $row["reaction"] . "</td>
        <td id='freq_" . $row["id"] . "' class='text-center'>" . $row["frequency"] . "</td>
        <td id='time_" . $row["id"] . "' class='text-center'>" . $row["timeout"] . "</td>
        <td>
          <span class='pull-right'>
            <button onClick='edit_entry(\"" . $row["id"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
            <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\", \"" . $row['trigger_word'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
          </span>
        </td>
    </tr>";
}

// Count
$count = db_query_prepared($db, "SELECT COUNT(`id`) as value FROM reactions", null, null)['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Reactions - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Reactions (<?php echo $count; ?>)
            <span class='pull-right'>
                <button type="button" class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-2">Trigger</th>
                    <th class="col-xs-7">Reaction</th>
                    <th class="col-xs-1">Frequency (%)</th>
                    <th class="col-xs-1">Timeout (s)</th>
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
            document.getElementById("reactions").className = "active";
        });

        function add_entry() {
            Swal.fire({
                title: "Add entry",
                html: "<form id='swal-form' method='post'>" +
                    "<input type='hidden' name='action' value='add'>" +
                    "<label>Trigger</label><input type='text' class='form-control' name='trigger_word' placeholder='Trigger' required><br/>" +
                    "<label>Reaction</label><input type='text' class='form-control' name='reaction' placeholder='Reaction' required><br/>" +
                    "<label>Frequency</label><input type='number' class='form-control' name='frequency' min=0 step=1 max=100 required><br/>" +
                    "<label>Timeout</label><input type='number' class='form-control' name='timeout' min=0 step=1 required><br/>" +
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

        function del_entry(id, trigger) {
            Swal.fire({
                title: "Delete '" + trigger + "' ?",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                focusCancel: true
            }).then((result) => {
                if (result.value) {
                    $.post("reactions.php", {
                        action: "del",
                        id: id
                    }, function(data) {
                        document.location.reload();
                    });
                }
            })
        }

        function edit_entry(id) {
            text = document.getElementById("text_" + id).innerText;
            freq = document.getElementById("freq_" + id).innerText;
            time = document.getElementById("time_" + id).innerText;
            Swal.fire({
                title: 'Editing : "' + id + '"',
                type: 'info',
                html: "<form id='swal-form' method='post'><br/>" +
                    "<input type='hidden' name='action' value='edit'>" +
                    "<input type='hidden' name='id' value='" + id + "'>" +
                    "<label>Text</label><input class='form-control' type='text' name='value' value=\"" + text + "\"><br/>" +
                    "<label>Frequency (%)</label><input class='form-control' type='number' name='frequency' min=0 step=1 max=100 value=\"" + freq + "\"><br/>" +
                    "<label>Timeout (s)</label><input class='form-control' type='number' name='timeout' min=0 step=1 value=\"" + time + "\"><br/>" +
                    "</form>",
                showCancelButton: true,
                focusConfirm: false,
                allowOutsideClick: false,
                width: "30%",
                confirmButtonText: 'Edit',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.value)
                    document.getElementById('swal-form').submit();
            })
        }
    </script>

</body>

</html>