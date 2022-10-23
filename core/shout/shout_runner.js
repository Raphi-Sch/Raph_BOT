const socket = require("../socket")
const db = require("../db")
const {config} = require("../config")

let shout_counter = 0;

async function run_shout(user, message) {
    shout_counter++;
    socket.shout_update(shout_counter, config.shout_interval);

    if (shout_counter > config.shout_interval) {
        const res = run_french(user, message);
        if (res) {
            shout_counter = 0;
            return res;
        } else {
            shout_counter = config.shout_interval - 1;
            return null;
        }
    }
}

async function run_french(user, message) {
    // Load shout remplacement
    const shout_words = await load_shout_words();

    //Split words of the sentence
    const word_array = message.toLowerCase().split(" ");

    //Do not take sentences too long
    if (word_array.length > 15)
        return false;

    message = "";
    let replaced_word = "";

    for (const word of word_array) {
        //If the word can not be replaced it does not change, otherwise it is modified
        replaced_word = (shout_words[word] ? shout_words[word] : word);

        //If the word contains "'", special treatment to replace the left and right part
        if (word.includes("'")) {
            //Split word with "'" in it
            const word_split = word.split("'");
            const replaced_word_L = shout_words[word_split[0]];
            const replaced_word_R = shout_words[word_split[1]];

            //If left side or right side of the word can be replaced
            if (replaced_word_L && replaced_word_R) {
                replaced_word = replaced_word_L + "'" + replaced_word_R;
            }
        }

        //Add the word to the message
        message += replaced_word + " ";
    }

    return "AH OUAIS @" + user["display-name"] + ", " + message.toUpperCase() + "!";
}

async function load_shout_words() {
    const sql = await db.query("SELECT * FROM shout");
    const result = {};

    try {
        sql.forEach(element => {
            result[element.original] = element.replacement
        });
        return result;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {run_shout}