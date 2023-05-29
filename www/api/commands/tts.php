<?php

function tts_run($db, $data)
{
    $text = $data['param'];
    $timeout = $data['tts_timeout'];

    // Load config dynamically
    $TTS_config = array();
    $data = db_query_raw($db, "SELECT `id`, `value` FROM commands_config WHERE id LIKE 'tts_%'");
    while ($row = mysqli_fetch_assoc($data)) {
        $TTS_config[$row['id']] = $row['value'];
    }

    // Active
    if ($TTS_config['tts_enable'] == 0) {
        if ($TTS_config['tts_text_answer'])
            return ['response_type' => null];
        else
            return ['response_type' => 'text', 'value' => $TTS_config['tts_text_disable'], 'mod_only' => 0, 'sub_only' => 0];
    }

    // Timeout
    if ((intval($timeout) > intval($TTS_config['tts_timeout_tolerance']))) {
        if ($TTS_config['tts_text_answer'])
            return ['response_type' => null];
        else
            return ['response_type' => 'text', 'value' => str_replace("@timeout", $timeout, $TTS_config['tts_text_timeout']), 'mod_only' => 0, 'sub_only' => 0];
    }

    // Format text output
    $text = $TTS_config['tts_prefix'] . " " . $text;

    return [
        'response_type' => 'tts',
        'value' => $text,
        'tts_type' => 'user',
        'mod_only' => intval($TTS_config['tts_mod_only']),
        'sub_only' => intval($TTS_config['tts_sub_only']),
        'timeout' => intval($TTS_config['tts_timeout'])
    ];
}
