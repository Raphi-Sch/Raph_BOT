<?php

require_once('../src/php/db.php');
$db = db_connect("../../config.json");
require_once('../src/php/auth.php');
require_once('../src/php/functions.php');

header('Content-Type: application/json');

// Abort after 2s
set_time_limit(2);

const MIN_WORDS = 3;
const MAX_WORDS = 15;

const TYPE_WORD = 0;
const TYPE_CONSONANT = 1;
const TYPE_VOWEL = 2;

const VOWELS = array("a", "e", "i", "o", "u", "y", "A", "E", "I", "O", "U", "Y");

switch ($_SERVER["REQUEST_METHOD"]) {
    case 'GET':
        if (isset($_GET['list'])) {
            echo json_encode(get_list($db));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($_GET['request'])) {
            switch ($body["language"]) {
                case "fr":
                    echo json_encode(shout_fr($db, $body["message"]));
                    break;

                case "fr-uwu":
                    echo json_encode(shout_fr_uwu($db, $body["message"]));
                    break;

                default:
                    header("HTTP/1.0 400 Bad request");
                    break;
            }
            exit();
        }

        header("HTTP/1.0 400 Bad request");
        exit();

    case 'PUT':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($body['original'])) {
            echo json_encode(add($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'PATCH':
        $body = json_decode(file_get_contents('php://input'), true, 512, JSON_OBJECT_AS_ARRAY);

        if (isset($body['id'])) {
            echo json_encode(edit($db, $body));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            echo json_encode(delete($db, $_GET['id']));
            break;
        }

        header("HTTP/1.0 400 Bad request");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        exit();
}

exit();

// GET Functions
function shout_fr(mysqli $db, string $message)
{
    // Basic clean
    $message = trim(strtolower($message));

    //Split words of the sentence
    $word_array = explode(" ", $message);

    //Do not take sentences too long
    $phrase_lenght = sizeof($word_array);
    if ($phrase_lenght < MIN_WORDS || $phrase_lenght > MAX_WORDS) {
        return ['value' => null];
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

    $message = strtoupper($message) . "!";

    // Send result
    return ['value' => $message];
}

function shout_fr_uwu(mysqli $db, string $message)
{
    $message = shout_fr($db, $message)['value'];

    if ($message === null) {
        return ['value' => null];
    }

    // Remplacement data
    $consonant = load_shout_words($db, "fr-uwu", TYPE_CONSONANT);
    $vowel = load_shout_words($db, "fr-uwu", TYPE_VOWEL);
    $word = load_shout_words($db, "fr-uwu", TYPE_WORD);

    // Letter by letter
    $previous_letter_replaced = false;
    $message_exploded = str_split($message, 1);
    for ($i = 1; $i < count($message_exploded); $i++) {
        if (array_key_exists($message_exploded[$i], $consonant)) {
            // Current letter can be replaced
            $message_exploded[$i] = $consonant[$message_exploded[$i]];
            $previous_letter_replaced = true;
        } else {
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

    return ['value' => $message];
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

function get_list(mysqli $db)
{
    $SQL_query = "SELECT * FROM shout ORDER BY `language` ASC, `type` ASC, original ASC";
    $data = db_query_raw($db, $SQL_query);

    $result = array();
    $count = 0;

    while ($row = $data->fetch_assoc()) {
        $result += array($count => ["id" => $row['id'], "original" => $row['original'], "replacement" => $row['replacement'], "language" => $row['language'], "type" => $row['type']]);
        $count++;
    }

    return $result;
}

function add(mysqli $db, $data)
{
    $original = trim($data['original']);
    $replacement = trim($data['replacement']);
    log_activity($db, "API", "[SHOUT] Added", $original);
    db_query_no_result($db, "INSERT INTO shout (`id`, `original`, `replacement`, `language`, `type`) VALUES (NULL, ?, ?, ?, ?)", "sssi", [$original, $replacement, $data['language'], $data['type']]);
    return true;
}

function edit(mysqli $db, $data)
{
    $original = trim($data['original']);
    $replacement = trim($data['replacement']);
    log_activity($db, "API", "[SHOUT] Edited", $original);
    db_query_no_result($db, "UPDATE `shout` SET `original` = ?, `replacement` = ?, `language` = ?, `type` = ? WHERE `id` = ?", "sssii", [$original, $replacement, $data['language'], $data['type'], $data['id']]);
    return true;
}

function delete(mysqli $db, $id)
{
    $original = db_query($db, "SELECT original FROM shout WHERE id = ?", "i", $id)['original'];
    log_activity($db, "API", "[SHOUT] Deleted", $original);
    db_query_no_result($db, "DELETE FROM shout WHERE id = ?", "i", $id);
    return true;
}