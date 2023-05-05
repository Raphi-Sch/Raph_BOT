<?php

function list_tts_config($db)
{
    $SQL_query = "SELECT * FROM commands_tts_config ORDER BY `id` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = mysqli_fetch_assoc($data)) {
        $result[$count] = $row;
        $count++;
    }

    return $result;
}

function run_TTS($db, $text, $timeout)
{
    // Load config dynamically
    $TTS_config = array();
    $data = db_query_raw($db, "SELECT `id`, `value` FROM commands_tts_config");
    while ($row = mysqli_fetch_assoc($data)) {
        $TTS_config[$row['id']] = $row['value'];
    }

    // Active
    if ($TTS_config['active'] == 0) {
        if ($TTS_config['no_text_answer'])
            return ['response_type' => null];
        else
            return ['response_type' => 'text', 'value' => $TTS_config['text_when_disable'], 'mod_only' => 0, 'sub_only' => 0];
    }

    // Timeout
    if ((intval($timeout) > intval($TTS_config['timeout_tolerance']))) {
        if ($TTS_config['no_text_answer'])
            return ['response_type' => null];
        else
            return ['response_type' => 'text', 'value' => str_replace("@timeout", $timeout, $TTS_config['text_when_timeout']), 'mod_only' => 0, 'sub_only' => 0];
    }

    // Format text output
    $text = $TTS_config['prefix'] . " " . $text;

    return [
        'response_type' => 'tts',
        'value' => $text,
        'tts_type' => 'user',
        'mod_only' => intval($TTS_config['mod_only']),
        'sub_only' => intval($TTS_config['sub_only']),
        'timeout' => intval($TTS_config['timeout'])
    ];
}

function tts_config_edit(mysqli $db, $data) {
    db_query_no_result(
        $db,
        "UPDATE `commands_tts_config` SET `value` = ? WHERE id = ?",
        "ss",
        [$data['value'], $data['id']]
    );

    log_activity($db, "API", "[COMMAND-TTS-CONFIG] Edited", $data['id']);
    return true;
}

