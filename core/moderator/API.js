const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { config } = require("../config");

async function checkMessage(message){
    const body = {
        message: message,
    }

    const response = await fetch(config.api_url + "moderator.php?check-message", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("[MODERATOR] API ERROR : " + response.status);
        console.error("Function checkMessage(), Context : ");
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

async function warnUser(user){
    const body = {
        userID: user.id,
        username: user.username
    }

    const response = await fetch(config.api_url + "moderator.php?warn-user", {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error("[MODERATOR] API ERROR : " + response.status);
        console.error("Function warnUser(), Context : ");
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

module.exports = { checkMessage, warnUser }