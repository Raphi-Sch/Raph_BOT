<?php

/**
 * Apply clean_string() on string in an array
 * @param array $input_array Array to clean
 * @return array Clean array
 */
function clean_string_in_array(array $input_array){
    $output_array = array();

    foreach($input_array as $value){
        $clean_string = clean_string($value);
        if(!empty($clean_string))
            array_push($output_array, $clean_string);
    }

    return $output_array;
}

/**
 * Remove all special caracter in string
 * This function execute remove_emoji()
 * @param string $string Input string
 * @return string Clean string
 */
function clean_string($string){
    $string = preg_replace("[']", ' ', $string);
    $string = remove_emoji($string);
    return $string;
}

/**
 * Remove common emoji in string
 * @param string $string Input string
 * @return string String without common emoji
 */
function remove_emoji($string)
{
    // Match Enclosed Alphanumeric Supplement
    $regex_alphanumeric = '/[\x{1F100}-\x{1F1FF}]/u';
    $clean_string = preg_replace($regex_alphanumeric, '', $string);

    // Match Miscellaneous Symbols and Pictographs
    $regex_symbols = '/[\x{1F300}-\x{1F5FF}]/u';
    $clean_string = preg_replace($regex_symbols, '', $clean_string);

    // Match Emoticons
    $regex_emoticons = '/[\x{1F600}-\x{1F64F}]/u';
    $clean_string = preg_replace($regex_emoticons, '', $clean_string);

    // Match Transport And Map Symbols
    $regex_transport = '/[\x{1F680}-\x{1F6FF}]/u';
    $clean_string = preg_replace($regex_transport, '', $clean_string);
    
    // Match Supplemental Symbols and Pictographs
    $regex_supplemental = '/[\x{1F900}-\x{1F9FF}]/u';
    $clean_string = preg_replace($regex_supplemental, '', $clean_string);

    // Match Miscellaneous Symbols
    $regex_misc = '/[\x{2600}-\x{26FF}]/u';
    $clean_string = preg_replace($regex_misc, '', $clean_string);

    // Match Dingbats
    $regex_dingbats = '/[\x{2700}-\x{27BF}]/u';
    $clean_string = preg_replace($regex_dingbats, '', $clean_string);

    return $clean_string;
}

/**
 * Convert L33T to regular text
 * @param string $string Input string
 * @return string String Input converted to regular text
 */
function unleet($db, $input)
{
    $leet_original = array();
    $leet_replacement = array();

    $leet_data = db_query_raw($db, "SELECT original, replacement FROM moderator_leet");
    while ($row = $leet_data->fetch_assoc()) {
        array_push($leet_original, $row['original']);
        array_push($leet_replacement, $row['replacement']);
    }

    return str_replace($leet_original, $leet_replacement, $input);
}

function timeout_to_string($seconds) {
    if($seconds >= 604800)
        return intval($seconds / 604800) + " week";

    if($seconds >= 86400)
        return intval($seconds / 86400) + " day";

    if($seconds >= 3600)
        return intval($seconds / 3600) + " hour";

    if($seconds >= 60)
        return intval($seconds / 60) + " min";

    if($seconds == 0)
        return "No timeout";

    return $seconds + " sec";
}