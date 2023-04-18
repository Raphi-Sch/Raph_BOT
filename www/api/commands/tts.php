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
    $data = db_query_raw($db, "SELECT * FROM commands_tts_config ORDER BY `id` ASC");
    while ($row = mysqli_fetch_assoc($data)) {
        $TTS_config[$row['id']] = $row['value'];
    }

    // Check if TTS user active
    if($TTS_config['active'] == 0){
        return ['response_type' => 'text', 'value' => "TTS is disabled.", 'mod_only' => 0, 'sub_only' => 0];
    }

    // TTS timeout
    if (intval($timeout) > 5) {
        return ['response_type' => 'text', 'value' => "TTS is not available yet (retry in $timeout seconds)", 'mod_only' => 0, 'sub_only' => 0];
    }

    return ['response_type' => 'tts', 'value' => $text, 'tts_type' => 'user', 'mod_only' => $TTS_config['mod_only'], 'sub_only' => $TTS_config['sub_only'], 'timeout' => $TTS_config['timeout']];
}
