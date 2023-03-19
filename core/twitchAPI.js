const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const configAPI = {
    authorizationToken : null,
    clientID : null,
    broadcasterID : null,
    moderatorID : null
}

async function init(broadcasterName, botName, clientID, authorizationToken){
    configAPI.authorizationToken = authorizationToken;
    configAPI.clientID = clientID;
    configAPI.broadcasterID = await getUserId(broadcasterName);
    configAPI.moderatorID = await getUserId(botName);
}

async function getUserId(userName) {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`, {
        method: "get",
        headers: {
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID
        }
    })

    if (response.ok) {
        const json = await response.json();
        return json.data[0].id;
    } else {
        console.error("[TWITCH API] Error while executing function getBroadcasterId() -> HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        process.exit(1);
    }
}

async function banUser(userID, reason) {
    const body = {
        data: {
            user_id: userID,
            reason: reason
        }
    }

    const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${configAPI.broadcasterID}&moderator_id=${configAPI.moderatorID}`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID
        }
    })

    if (response.ok) {
        return true;
    } else {
        console.error("[TWITCH API] Error while executing function banUser() -> HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        return null;
    }
}

async function timeoutUser(userID, reason, duration) {
    const body = {
        data: {
            user_id: userID,
            reason: reason,
            duration: duration
        }
    }

    const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${configAPI.broadcasterID}&moderator_id=${configAPI.moderatorID}`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID,
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {
        return true;
    } else {
        console.error("[TWITCH API] Error while executing function timeoutUser() -> HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        return null;
    }
}

module.exports = { init, banUser, timeoutUser }