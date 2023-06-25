const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { config } = require("../config");

async function checkMessage(message){
    const body = {
        message: message,
    }

    const response = await fetch(config.apiUrl + "moderator.php?check-message", {
        method: "post",
        body: JSON.stringify(body),
        headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${config.apiToken}`,
            "Client" : config.apiClient
        }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`[MODERATOR] API ERROR : ${response.status} ${response.statusText}`);
        console.error("Function checkMessage(), Context : ");
        console.error(message);
        console.error("-------------------");
        return null;
    }
}

async function warnUser(user){
    const body = {
        userid: user.id,
        username: user.login
    }

    const response = await fetch(config.apiUrl + "moderator.php?warn-user", {
        method: "post",
        body: JSON.stringify(body),
        headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${config.apiToken}`,
            "Client" : config.apiClient
        }
    })
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`[MODERATOR] API ERROR : ${response.status} ${response.statusText}`);
        console.error("Function warnUser(), Context : ");
        console.error(body);
        console.error("-------------------");
        return null;
    }
}

module.exports = { checkMessage, warnUser }