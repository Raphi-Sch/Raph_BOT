<?php

function list_audio(mysqli $db)
{
    $SQL_query = "SELECT * FROM commands_audio ORDER BY `name` ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = mysqli_fetch_assoc($data)) {
        $result += array($count => ["id" => $row['id'], "name" => $row["name"], "trigger_word" => $row["trigger_word"], "volume" => $row["volume"], 
            "timeout" => $row["timeout"], "file" => $row['file'], "active" => $row['active'], 'mod_only' => $row['mod_only'], 'sub_only' => $row['sub_only']]);
        $count++;
    }

    return $result;
}

function list_audio_text(mysqli $db){
    $result = "Audio commands : ";
    $first = true;

    $data = db_query_raw($db, "SELECT * FROM commands_audio WHERE active = 1 AND sub_only = 0 AND mod_only = 0 ORDER BY `trigger_word` ASC");
    while ($row = mysqli_fetch_assoc($data)) {
        if ($first){
            $result .= "!" . $row['trigger_word'];
            $first = false;
        }
        else
            $result .= ", !" . $row['trigger_word'];
    }

    $first = true;
    $data = db_query_raw($db, "SELECT * FROM commands_audio WHERE active = 1 AND sub_only = 1 ORDER BY `trigger_word` ASC");
    while ($row = mysqli_fetch_assoc($data)) {
        if ($first){
            $result .= " - Sub only : !" . $row['trigger_word'];
            $first = false;
        }
        else
            $result .= ", !" . $row['trigger_word'];
    }

    return ['response_type' => 'text', 'value' => $result];
}

function request_audio(mysqli $db, string $command, array $excluded_audio)
{
    $SQL_params_type = "";
    $SQL_params = array();
    $trigger_word_not_in = "";

    if(in_array($command, $excluded_audio)){
        return ['response_type' => 'text', 'value' => "Command '!$command' is not available yet."];
    }

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

    $SQL_query = "SELECT * FROM commands_audio WHERE trigger_word = ? AND active = 1 $trigger_word_not_in";
    $result = db_query($db, $SQL_query, $SQL_params_type, $SQL_params);

    if ($result == null)
        return null;
    else
        return ['response_type' => 'audio', "id" => $result['id'], 'trigger_word' => $result['trigger_word'], 'timeout' => $result['timeout'], 'file' => $result['file'], 
            'name' => $result['name'], 'volume' => $result['volume'], 'mod_only' => $result['mod_only'], 'sub_only' => $result['sub_only']];
}
