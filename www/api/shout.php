<?php

require_once('../src/php/db.php');

$db = db_connect("../../config.json");

// Abort after 2s
set_time_limit(2);

const MIN_WORDS = 3;
const MAX_WORDS = 15;

const TYPE_WORD = 0;
const TYPE_CONSONANT = 1;
const TYPE_VOWEL = 2;

const VOWELS = array("a", "e", "i", "o", "u", "y", "A", "E", "I", "O", "U", "Y");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY)['data'][0];

        if ($data["method"] == "get_shout" && $data["language"] == "fr") {
            echo json_encode(['value' => get_shout_fr($db, $data["message"])]);
            break;
        }

        if ($data["method"] == "get_shout" && $data["language"] == "fr-uwu") {
            echo json_encode(['value' => get_shout_fr_uwu($db, $data["message"])]);
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
        return null;
    }

    // Load shout remplacement
    $shout_words = load_shout_words($db, "fr", 0);

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
    return $message;
}

function get_shout_fr_uwu(mysqli $db, string $message)
{
    $message = get_shout_fr($db, $message);

    // Remplacement data
    $consonant = load_shout_words($db, "fr-uwu", TYPE_CONSONANT);
    $vowel = load_shout_words($db, "fr-uwu", TYPE_VOWEL);
    $word = load_shout_words($db, "fr-uwu", TYPE_WORD);

    // Letter by letter
    $previous_letter_replaced = false;
    $message_exploded = str_split($message, 1);
    for ($i = 1; $i < count($message_exploded); $i++) {
        if(array_key_exists($message_exploded[$i], $consonant)){
            // Current letter can be replaced
            $message_exploded[$i] = $consonant[$message_exploded[$i]];
            $previous_letter_replaced = true;
        }
        else{
            if (!in_array($message_exploded[$i - 1], VOWELS) && !$previous_letter_replaced) {
                // Previous letter is not a vowel and not already replaced
                if (array_key_exists($message_exploded[$i], $vowel)) {
                    // Current letter can be replaced
                    $message_exploded[$i] = $vowel[$message_exploded[$i]];
                }
            }
            $previous_letter_replaced = false;
        }
    }
    $message = implode("", $message_exploded);

    // Word by word
    $message = str_replace(array_keys($word), array_values($word), $message);

    return $message;
}

function load_shout_words(mysqli $db, string $language, int $type)
{
    $query = "SELECT * FROM shout WHERE `language` = ? AND `type` = ?";
    $result = db_query_raw($db, $query, "si", [$language, $type]);
    $data = array();

    while ($row = $result->fetch_assoc()) {
        $data[$row['original']] = $row['replacement'];
    }

    return $data;
}
