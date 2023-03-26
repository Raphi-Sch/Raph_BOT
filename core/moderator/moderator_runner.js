const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const socket = require("../socket");
const { config } = require("../config");
const tools = require("../tools");
const actionText = ["Ban", "Timeout", "Delete message"];

const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

async function runModerator(user, message) {
    const result = await queryAPI(message);

    try {
        if (result && result.mod_action) {
            socket.log(`[MODERATOR] Taking action against '${user['display-name']}' for saying '${result.trigger_word}' (Context : '${message}', Action : ${actionText[result.mod_action]}, Duration : ${tools.timeoutToString(result.duration)})`);
            result.explanation = result.explanation.replace("@username", user['display-name']);
            return result;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

async function queryAPI(message){
    const body = {
        message: message,
    }

    const response = await fetch(config.api_url + "moderator.php?request", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("[MODERATOR] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

module.exports = { runModerator }