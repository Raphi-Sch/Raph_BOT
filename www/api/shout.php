<?php

require_once('../src/php/db.php');

$db = db_connect("../../config.json");

const MIN_WORDS = 3;
const MAX_WORDS = 15;

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data["method"] == "get_shout" && $data["language"] == "fr") {
            echo get_shout_fr($db, $data["message"]);
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

exit();

// GET Functions
function get_shout_fr(mysqli $db, string $message)
{
    // Basic clean
    $message = trim(strtolower($message));

    //Split words of the sentence
    $word_array = explode(" ", $message);

    //Do not take sentences too long
    $phrase_lenght = sizeof($word_array);
    if ($phrase_lenght < MIN_WORDS || $phrase_lenght > MAX_WORDS) {
        return json_encode(['value' => null]);
    }

    // Load shout remplacement
    $shout_words = load_shout_words($db);

    $message = "";
    $replaced_word = "";
    $word_split = "";
    $replaced_word_L = "";
    $replaced_word_R = "";

    foreach ($word_array as $word) {
        //If the word can not be replaced it does not change, otherwise it is modified
        $replaced_word = (isset($shout_words[$word]) ? $shout_words[$word] : $word);

        //If the word contains "'", special treatment to replace the left and right part
        if (strpos($word, "'") !== false) {
            //Split word with "'" in it
            $word_split = explode("'", $word);
            $replaced_word_L = $shout_words[$word_split[0]];
            $replaced_word_R = $shout_words[$word_split[1]];

            //If left side or right side of the word can be replaced
            if ($replaced_word_L && $replaced_word_R) {
                $replaced_word = $replaced_word_L . "'" . $replaced_word_R;
            }
        }

        //Add the word to the message
        $message .= $replaced_word . " ";
    }

    $message = "AH OUAIS @username, " . strtoupper($message) . "!";

    // Send result
    return json_encode(['value' => $message]);
}

function load_shout_words($db)
{
    $query = "SELECT * FROM shout";
    $result = db_query_raw($db, $query);
    $data = array();

    while ($row = $result->fetch_assoc()) {
        $data[$row['original']] = $row['replacement'];
    }

    return $data;
}
