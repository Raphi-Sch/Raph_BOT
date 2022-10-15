<?php

function guidv4($data = null) {
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

function file_upload($file_field, $dest_dir, $name_prefix = "", $original_name = false, $new_name = "", $extension = ""){
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
            $size = $_FILES[$file_field]['size'] / $MAX_FILE_SIZE;
            throw new RuntimeException("File size is larger than the server allows. (Limit : ".number_format($MAX_FILE_SIZE/1048576, 2)." MB, Your file : ".number_format($_FILES[$file_field]['size'] / 1048576, 2)." MB).");
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
        if($original_name)
            $name = pathinfo($_FILES[$file_field]['name'])['filename'];
        else
            if(empty($new_name))
                $name = sha1_file($_FILES[$file_field]['tmp_name']);
            else
                $name = $new_name;

        // Extension
        if($extension){
            $ext = $extension;
        }

        // Move
        if (!move_uploaded_file($_FILES[$file_field]['tmp_name'],sprintf("$dest_dir/%s.%s",$name_prefix.$name,$ext))) {
            throw new RuntimeException('Unable to move the file.');
        }
    }
    catch (RuntimeException $e) {
        $_SESSION['alert'] = ["error", "Error when receiving the file", $e->getMessage()];
        return false; // Error append
    }
    return $name.".".$ext; // Everything OK
}