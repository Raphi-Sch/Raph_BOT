<?php

function tts_run($db, $data)
{
    $text = $data['param'];
    $tts_text_to_chat = "";

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
    if (boolval($TTS_config['tts_text_answer'])){
        $tts_text_to_chat = $TTS_config['tts_text_timeout'];
    }
    
    // Format text output
    $text = $TTS_config['tts_prefix'] . " " . $text;

    return [
        'response_type' => 'tts',
        'value' => $text,
        'tts_type' => 'user',
        'mod_only' => intval($TTS_config['tts_mod_only']),
        'sub_only' => intval($TTS_config['tts_sub_only']),
        'timeout' => intval($TTS_config['tts_timeout']),
        'tts_text_to_chat' => $tts_text_to_chat
    ];
}
