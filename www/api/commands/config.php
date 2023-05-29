<?php

function config_list($db)
{
    $SQL_query = "SELECT * FROM commands_config ORDER BY `id` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = mysqli_fetch_assoc($data)) {
        $result[$count] = $row;
        $count++;
    }

    return $result;
}

function config_edit(mysqli $db, $data)
{
    db_query_no_result(
        $db,
        "UPDATE `commands_config` SET `value` = ? WHERE id = ?",
        "ss",
        [$data['value'], $data['id']]
    );

    log_activity("API", "[COMMAND-CONFIG] Edited", $data['id']);
    return true;
}