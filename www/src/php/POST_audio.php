<?php

require_once("./header-post.php");

// Add
if ($_POST['action'] == "add" && !empty($_POST['name']) && !empty($_POST['trigger'])) {
    $name = trim($_POST['name']);
    $trigger = trim($_POST['trigger']);
    $volume = floatval($_POST['volume']);
    $freq = intval($_POST['freq']);
    $timeout = intval($_POST['timeout']);
    $file_name = file_upload("audio", dirname(__FILE__) . "/../audio", "", false, guidv4());

    if ($file_name) {
        db_query_no_result($db, "INSERT INTO audio VALUES (NULL, ?, ?, ?, ?, ?, ?)", "sssdii", [$name, $trigger, $file_name, $volume, $timeout, $freq]);
    }

    header('Location: ../../audio.php');
    exit();
}

// Edit
if ($_POST['action'] == "edit" && !empty($_POST['id'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $trigger = $_POST['trigger'];
    $volume = floatval($_POST['volume']);
    $freq = intval($_POST['freq']);
    $timeout = intval($_POST['timeout']);

    db_query_no_result($db, "UPDATE `audio` SET `name` = ?, `trigger_word` = ?, `volume` = ?, `frequency` = ?, `timeout` = ? WHERE id = ?", "ssdiii", [$name, $trigger, $volume, $freq, $timeout, $id]);

    header('Location: ../../audio.php');
    exit();
}

// SYNC
// ----
// ASYNC

// Delete
if ($_POST['action'] == "del" && !empty($_POST['id'])) {
    $id = $_POST['id'];

    // Get filename
    $file = db_query($db, "SELECT `file` FROM audio WHERE id = ?", "i", $id)['file'];

    // Remove file
    shell_exec("rm src/audio/$file");

    // Remove from database
    db_query_no_result($db, "DELETE FROM audio WHERE id = ?", "i", $id);

    exit();
}

exit();
