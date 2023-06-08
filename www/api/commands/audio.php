<?php

function audio_load_config(mysqli $db)
{
    $config = array();

    $data = db_query_raw($db, "SELECT `id`, `value` FROM commands_config WHERE id LIKE 'audio_%'");
    while ($row = mysqli_fetch_assoc($data)) {
        $config[$row['id']] = $row['value'];
    }

    return $config;
}

function audio_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands_audio ORDER BY `name` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = mysqli_fetch_assoc($data)) {
        $result[$count] = $row;
        $count++;
    }

    return $result;
}

function audio_list_text(mysqli $db)
{
    $config = audio_load_config($db);
    $result = $config['audio_list_prefix'];
    $first = true;

    $data = db_query_raw($db, "SELECT * FROM commands_audio WHERE active = 1 AND sub_only = 0 AND mod_only = 0 ORDER BY `trigger_word` ASC");
    while ($row = mysqli_fetch_assoc($data)) {
        if ($first) {
            $result .= "!" . $row['trigger_word'];
            $first = false;
        } else
            $result .= ", !" . $row['trigger_word'];
    }

    $first = true;
    $data = db_query_raw($db, "SELECT * FROM commands_audio WHERE active = 1 AND sub_only = 1 ORDER BY `trigger_word` ASC");
    while ($row = mysqli_fetch_assoc($data)) {
        if ($first) {
            $result .= " - Sub only : !" . $row['trigger_word'];
            $first = false;
        } else
            $result .= ", !" . $row['trigger_word'];
    }

    return ['response_type' => 'text', 'value' => $result, 'mod_only' => 0, 'sub_only' => 0];
}

function audio_request(mysqli $db, $data)
{
    $config = audio_load_config($db);
    $command = $data['command'];
    $excluded_audio = $data['audio_excluded'];

    // Specific timeout
    if (in_array($command, $excluded_audio)) {
        return ['response_type' => 'text', 'value' => str_replace("@audio", $command, $config['audio_text_individual_timeout'])];
    }

    $SQL_params_type = "";
    $SQL_params = array();
    $trigger_word_not_in = "";

    // Command
    $SQL_params_type .= "s";
    array_push($SQL_params, $command);

    // Build audio not in
    if (count($excluded_audio) > 0) {
        $excluded_audio_count = count($excluded_audio);
        $trigger_word_not_in = " AND trigger_word NOT IN (" . join(',', array_fill(0, $excluded_audio_count, '?')) . ")";
        $SQL_params_type .= str_repeat('s', $excluded_audio_count);
        $SQL_params = array_merge($SQL_params, $excluded_audio);
    }

    $SQL_query = "SELECT * FROM commands_audio WHERE trigger_word = ? AND active = 1 $trigger_word_not_in ORDER BY RAND() LIMIT 1";
    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_params);

    $timeout = intval(db_query($db, "SELECT `value` FROM commands_config WHERE id = 'audio_timeout'")['value']);

    if ($result == null)
        return null;
    else {
        // Global timeout
        if ($data['audio_timeout'] > 0) {
            return ['response_type' => 'text', 'value' => str_replace("@timeout", $data['audio_timeout'], $config['audio_text_global_timeout'])];
        }

        return array_merge(['response_type' => 'audio', 'global_timeout' => $timeout], $result);
    }
}

function audio_edit(mysqli $db, $data)
{
    $id = $data['id'];
    $name = $data['name'];
    $trigger = $data['trigger'];
    $volume = floatval($data['volume']);
    $timeout = intval($data['timeout']);
    $active = boolval($data['active']);
    $mod_only = boolval($data['mod_only']) || boolval($data['sub_only']);
    $sub_only = boolval($data['sub_only']);

    db_query_no_result(
        $db,
        "UPDATE `commands_audio` SET `name` = ?, `trigger_word` = ?, `volume` = ?, `timeout` = ?, `active` = ?, `mod_only` = ?, `sub_only` = ? WHERE id = ?",
        "ssdiiiii",
        [$name, $trigger, $volume, $timeout, $active, $mod_only, $sub_only, $id]
    );

    log_activity("API", "[COMMAND-AUDIO] Edited", $name);
    return true;
}

function audio_delete(mysqli $db, $id)
{
    // Get file data
    $file_data = db_query($db, "SELECT `name`, `file` FROM commands_audio WHERE id = ?", "i", $id);

    // Remove file
    unlink("../audio/" . $file_data['file']);

    // Remove from database
    db_query_no_result($db, "DELETE FROM commands_audio WHERE id = ?", "i", $id);

    log_activity("API", "[COMMAND-AUDIO] Deleted", $file_data['name']);
    return true;
}
