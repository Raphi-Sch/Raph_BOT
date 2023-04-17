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

function run_TTS($text, $timeout)
{
    if (intval($timeout) > 5) {
        return ['response_type' => 'text', 'value' => "TTS is not available yet (retry in $timeout seconds)", 'mod_only' => 0, 'sub_only' => 0];
    }

    return ['response_type' => 'tts', 'value' => $text, 'tts_type' => 'user', 'mod_only' => 0, 'sub_only' => 0];
}
