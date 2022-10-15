<?php
require_once('src/php/header.php');

//POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == "add" && !empty($_POST['form_key']) && !empty($_POST['form_nation']) && !empty($_POST['form_tier']) && !empty($_POST['form_type']) && !empty($_POST['form_name'])) {
        $trigger_word = strtolower(sanitise_input($db, $_POST['form_key']));
        $nation = sanitise_input($db, $_POST['form_nation']);
        $tier = sanitise_input($db, $_POST['form_tier']);
        $name = sanitise_input($db, $_POST['form_name']);
        $mark = sanitise_input($db, $_POST['form_mark']);
        $max_dmg = sanitise_input($db, $_POST['form_max_dmg']);
        $type = sanitise_input($db, $_POST['form_type']);
        $note = sanitise_input($db, $_POST['form_note']);

        $max_dmg = empty($max_dmg) ? 0 : $max_dmg;

        db_query_no_result($db, "INSERT INTO tanks VALUES (NULL, '$trigger_word', '$nation', '$tier', '$name', '$mark', '$max_dmg', '$note', '$type')");
    }

    if ($_POST['action'] == "del") {
        $id = sanitise_input($db, $_POST['id']);
        db_query_no_result($db, "DELETE FROM tanks WHERE tanks.id='$id'");
    }

    if ($_POST['action'] == "edit") {
        $id = sanitise_input($db, $_POST['swal-key']);
        $trigger_word = sanitise_input($db, $_POST['swal-trigger']);
        $name = sanitise_input($db, $_POST['swal-name']);
        $dmg = sanitise_input($db, $_POST['swal-dmg']);
        $mark = sanitise_input($db, $_POST['swal-mark']);
        $note = sanitise_input($db, $_POST['swal-note']);
        $id = sanitise_input($db, $_POST['swal-key']);
        db_query_no_result($db, "UPDATE `tanks` SET `trigger_word` = '$trigger_word', `name` = '$name', `mark` = '$mark', `max_dmg` = '$dmg', `note` = '$note' WHERE `id` = '$id'");
    }

    header('Location: tanks.php');
    exit();
}

// List tank
$HTML = "";
$result = db_query_raw($db, "SELECT * FROM tanks ORDER BY `trigger_word` ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $HTML .= "
  <tr id='" . $row["id"] . "'>
    <td id='trigger_word'>" . $row["trigger_word"] . "</td>
    <td id='name'>" . $row["name"] . "</td>
    <td id='nation'>" . $row["nation"] . "</td>
    <td id='tier'>" . $row["tier"] . "</td>
    <td id='mark'>" . $row["mark"] . "</td>
    <td id='max_dmg'>" . $row["max_dmg"] . "</td>
    <td id='type'>" . $row["type"] . "</td>
    <td id='note'>" . $row["note"] . "</td>
    <td>
      <span class='pull-right'>
        <button onClick='edit_entry(\"" . $row["id"] . "\")' class='btn btn-warning' type='button'><i class='glyphicon glyphicon-pencil'></i></button>
        <button type='button' class='btn btn-danger' onclick='del_entry(\"" . $row['id'] . "\")'><i class='glyphicon glyphicon-remove'></i></button>
      </span>
    </td>
  </tr>";
}

// Count tank
$count = db_query($db, "SELECT COUNT(`id`) as value FROM tanks")['value'];

?>

<!DOCTYPE html>
<html>

<head>
    <title>Tanks - <?php echo $bot_name; ?></title>
    <?php include("src/html/header.html"); ?>
</head>

<body>
    <!-- TOP Navbar -->
    <?php include("src/php/navbar.php"); ?>

    <!-- Side bar-->
    <?php include("src/html/sidebar.html"); ?>

    <!-- Main area -->
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h1 class="page-header">Tanks (<?php echo $count; ?>)
            <span class='pull-right'>
                <button class="btn btn-success" onclick='add_entry()'><i class="glyphicon glyphicon-plus"></i></button>
            </span>
        </h1>

        <!-- Add command -->
        <table class="table table-hover table-condensed">
            <thead>
                <tr>
                    <th class="col-xs-1">Trigger</th>
                    <th class="col-xs-2">Name</th>
                    <th class="col-xs-1">Nation</th>
                    <th class="col-xs-1">Tier</th>
                    <th class="col-xs-1">Mark</th>
                    <th class="col-xs-1">Damage</th>
                    <th class="col-xs-1">Type</th>
                    <th class="col-xs-3">Note</th>
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
            document.getElementById("tanks").className = "active";
        });

        function add_entry() {
            Swal.fire({
                title: "New tank",
                html: "<form id='swal-form' method='post'>" +
                    "<input type='hidden' name='action' value='add'>" +
                    // Key
                    "<label>Tank trigger</label><input type='text' class='form-control' name='form_key' required></br>" +
                    // Name
                    "<label>Tank name</label><input type='text' class='form-control' name='form_name' required></br>" +
                    // Nation
                    "<label>Nation</label><select class='form-control' name='form_nation' required><option>china</option><option>czechoslovakia</option><option>france</option>" +
                    "<option>germany</option><option>italy</option><option>japan</option><option>poland</option><option>sweden</option><option>uk</option><option>usa</option><option>ussr</option></select></br>" +
                    // Tier
                    "<label>Tier</label><select class='form-control' name='form_tier' required><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></br>" +
                    // Type
                    "<label>Type</label><select class='form-control' name='form_type' required><option>light</option><option>medium</option><option>heavy</option><option>td</option><option>spg</option></select></br>" +
                    // Mark
                    "<label>MoE</label><select class='form-control' name='form_mark' required><option>0</option><option>1</option><option>2</option><option>3</option></select></br>" +
                    // Max dmg
                    "<label>Damage max</label><input type='text' class='form-control' name='form_max_dmg' required></br>" +
                    // Note
                    "<label>Note</label><input type='text' class='form-control' name='form_note'/>" +
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

        function del_entry(id) {
            Swal.fire({
                title: "Delete '" + id + "' ?",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    $.post("tanks.php", {
                        action: "del",
                        id: id
                    }, function(data) {
                        document.location.reload();
                    });
                }
            })
        }

        function edit_entry(id) {
            var tank = document.getElementById(id).children;
            var trigger_word = tank.trigger_word.textContent;
            var name = tank.name.textContent;
            var mark = tank.mark.textContent;
            var max_dmg = tank.max_dmg.textContent;
            var note = tank.note.textContent;

            Swal.fire({
                title: 'Editing : "' + trigger_word + '"',
                type: 'info',
                html: "<form id='swal-form' method='post' class='form-vertical'>" +
                    "<input type='hidden' name='action' value='edit'>" +
                    "<input type='hidden' name='swal-key' value='" + id + "'>" +
                    "<label>Trigger</label><input class='form-control' type='text' name='swal-trigger' value='" + trigger_word + "'></br>" +
                    "<label>Tank name</label><input class='form-control' type='text' name='swal-name' value='" + name + "'></br>" +
                    "<label>Mark</label><input class='form-control' type='number' min=0 max=3 name='swal-mark' value='" + mark + "'></br>" +
                    "<label>Damage max</label><input class='form-control' type='number' name='swal-dmg' value='" + max_dmg + "'></br>" +
                    "<label>Note</label><input class='form-control' type='text' name='swal-note' value='" + note + "'></br>" +
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