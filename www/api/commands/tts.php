<?php

function tts_run($db, $data)
{
    $text = $data['param'];

    // Load config dynamically
    $TTS_config = array();
    $data_config = db_query_raw($db, "SELECT `id`, `value` FROM commands_config WHERE id LIKE 'tts_%'");
    while ($row = mysqli_fetch_assoc($data_config)) {
        $TTS_config[$row['id']] = $row['value'];
    }

    // Active
    if (!boolval($TTS_config['tts_enable'])) {
        if (boolval($TTS_config['tts_text_answer'])){
            return ['response_type' => 'text', 'value' => $TTS_config['tts_text_disable'], 'mod_only' => 0, 'sub_only' => 0];
        }
        return ['response_type' => null];
    }

    // Timeout
    $tts_text_timeout = "";
    $tts_text_playing = "";

    if (boolval($TTS_config['tts_text_answer'])){
        $tts_text_timeout = $TTS_config['tts_text_timeout'];
        $tts_text_playing = $TTS_config['tts_text_playing'];
    }
    
    // Format text output
    $text = $TTS_config['tts_prefix'] . " " . $text;

    return [
        'response_type' => 'tts',
        'value' => $text,
        'type' => 'user',
        'mod_only' => intval($TTS_config['tts_mod_only']),
        'sub_only' => intval($TTS_config['tts_sub_only']),
        'timeout' => intval($TTS_config['tts_timeout']),
        'text_timeout' => $tts_text_timeout,
        'text_playing' => $tts_text_playing
    ];
}
