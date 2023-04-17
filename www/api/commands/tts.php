<?php

function run_TTS($text, $timeout){
    if(intval($timeout) > 5){
        return ['response_type' => 'text', 'value' => "TTS is not available yet (retry in $timeout seconds)", 'mod_only' => 0, 'sub_only' => 0];
    }
        
    return ['response_type' => 'tts', 'value' => $text, 'tts_type' => 'user', 'mod_only' => 0, 'sub_only' => 0];   
}