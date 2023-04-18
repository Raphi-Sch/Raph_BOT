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
    if($TTS_config['active'] == 0){
        return ['response_type' => 'text', 'value' => "@username : TTS is disabled", 'mod_only' => 0, 'sub_only' => 0];
    }

    // Timeout
    if (intval($timeout) > 5) {
        return ['response_type' => 'text', 'value' => "@username : TTS is not available yet (retry in $timeout seconds)", 'mod_only' => 0, 'sub_only' => 0];
    }

    // Format text output
    $text = $TTS_config['prefix'] . " " . $text;

    return ['response_type' => 'tts', 'value' => $text, 'tts_type' => 'user', 'mod_only' => intval($TTS_config['mod_only']), 'sub_only' => intval($TTS_config['sub_only']), 'timeout' => intval($TTS_config['timeout'])];
}
