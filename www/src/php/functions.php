<?php

function guidv4($data = null)
{
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);

    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    // Output the 36 character UUID.
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function file_upload($file_field, $dest_dir, $name_prefix = "", $original_name = false, $new_name = "", $extension = "")
{
    // Return true if everything OK.
    $MAX_FILE_SIZE = 10485760;
    try {
        // If this request falls under any of them, treat it invalid.
        if (!isset($_FILES[$file_field]['error']) || is_array($_FILES[$file_field]['error'])) {
            throw new RuntimeException('Invalid input field.');
        }

        // Check $_FILES[$file_field]['error'] value.
        switch ($_FILES[$file_field]['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('No file send.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new RuntimeException('File size is larger than the server allows.');
            default:
                throw new RuntimeException('Unknown error');
        }

        // You should also check filesize here. 1MB = 1048576 Bytes
        if ($_FILES[$file_field]['size'] > $MAX_FILE_SIZE) {
            throw new RuntimeException("File size is larger than the server allows. (Limit : " . number_format($MAX_FILE_SIZE / 1048576, 2) . " MB, Your file : " . number_format($_FILES[$file_field]['size'] / 1048576, 2) . " MB).");
        }

        // Check MIME
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        if (false === $ext = array_search(
            $finfo->file($_FILES[$file_field]['tmp_name']),
            array(
                'mp3' => 'audio/mpeg',
            ),
            true
        )) {
            throw new RuntimeException('File format not supported.');
        }

        // Name
        if ($original_name) {
            $name = pathinfo($_FILES[$file_field]['name'])['filename'];
        } else {
            if (empty($new_name)) {
                $name = sha1_file($_FILES[$file_field]['tmp_name']);
            } else {
                $name = $new_name;
            }
        }

        // Extension
        if ($extension) {
            $ext = $extension;
        }

        // Move
        if (!move_uploaded_file($_FILES[$file_field]['tmp_name'], sprintf("$dest_dir/%s.%s", $name_prefix . $name, $ext))) {
            throw new RuntimeException('Unable to move the file.');
        }
    } catch (RuntimeException $e) {
        $_SESSION['alert'] = ["error", "Error when receiving the file", $e->getMessage()];
        return false; // Error append
    }
    return $name . "." . $ext; // Everything OK
}

function error_post()
{
    error_log("UNAUTHORIZED Request method :" . $_SERVER['REQUEST_METHOD'] . ", on : " . $_SERVER['REQUEST_URI'] . ", referer : " . $_SERVER['HTTP_REFERER']);
}

function log_activity($user, $title, $message = null)
{
    if ($message) {
        $title = $title  . " (" . $message . ")";
    }

    $row = "[" . date('Y-m-d H:i:s') . "] [" . $user . "] " . $title . "\n";

    file_put_contents(dirname(__FILE__) . "/../activity.log", $row, FILE_APPEND);
}

/**
 * Apply clean_string() on string in an array
 * @param array $input_array Array to clean
 * @return array Clean array
 */
function clean_string_in_array(array $input_array)
{
    $output_array = array();

    foreach ($input_array as $value) {
        $clean_string = clean_string($value);
        if (!empty($clean_string))
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
function clean_string($string)
{
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

function timeout_to_string($seconds)
{
    if ($seconds >= 604800) {
        return intval($seconds / 604800) . " week";
    }

    if ($seconds >= 86400) {
        return intval($seconds / 86400) . " day";
    }

    if ($seconds >= 3600) {
        return intval($seconds / 3600) . " hour";
    }

    if ($seconds >= 60) {
        return intval($seconds / 60) . " min";
    }

    if ($seconds == 0) {
        return "No timeout";
    }

    return $seconds . " sec";
}
