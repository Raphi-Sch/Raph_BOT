<?php

function config_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands_config ORDER BY `id` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();

    while ($row = mysqli_fetch_assoc($data)) {
        $result[$row['id']] = ['value' => $row['value'], 'type' => $row['type']];
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