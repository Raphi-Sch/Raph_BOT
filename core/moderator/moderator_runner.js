const tools = require("../tools")
const db = require("../db")
const socket = require("../socket")

const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

async function run_moderator(user, message) {
    const words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    //const result = await query_moderator(words);
    const result = await api_moderator(words);

    try {
        if (result) {
            socket.log(`[MODERATOR] Taking action against ${user['display-name']} for saying ${message} (Action : ${result.mod_action} )`);

            result.mod_action = result.mod_action.replace("@username", user['display-name']);
            result.explanation = result.explanation.replace("@username", user['display-name']);

            return result;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

async function query_moderator(words) {
    const trigger_word_in = words.map(() => "?").join(",")
    const res = await db.query(`SELECT mod_action, explanation
                                  FROM moderator
                                  WHERE moderator.trigger_word IN (${trigger_word_in})
                                  ORDER BY RAND() LIMIT 1`, words);

    return tools.first_of_array(res);
}

async function api_moderator(words){
    const body = {
        data: [{
            method: "get_moderator",
            words: words,
        }]
    }

    const response = await fetch(API_URL + "moderator.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("API ERROR : " + response.status);
        return null;
    }
}

module.exports = { run_moderator }