const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const socket = require("../socket");
const { config } = require("../config");
const tools = require("../tools");
const actionText = ["Ban", "Timeout"];

const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

async function run_moderator(user, message) {
    const words = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, ' ').split(" ");
    const result = await queryAPI(words);

    try {
        if (result && result.mod_action) {
            socket.log(`[MODERATOR] Taking action against '${user['display-name']}' for saying '${message}' (Action : ${actionText[result.mod_action]}, Duration : ${tools.timeoutToString(result.duration)})`);
            result.explanation = result.explanation.replace("@username", user['display-name']);
            return result;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

async function queryAPI(words){
    const body = {
        data: [{
            method: "get_moderator",
            words: words,
        }]
    }

    const response = await fetch(config.api_url + "moderator.php", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("[MODERATOR] API ERROR : " + response.status);
        console.error("Context : ");
        console.error(words);
        console.error("-------------------");
        return null;
    }
}

module.exports = { run_moderator }