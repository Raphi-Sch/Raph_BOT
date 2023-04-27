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

function errorLog(functionName, response) {
    const date = new Date;
    const time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}.${('00' + date.getMilliseconds()).slice(-3)}`;
    msg = `[${time}] [TWITCH API] Error while executing function ${functionName} -> HTTP ERROR : ${response.status} (${response.statusText})\n`;
    console.error(msg);
    console.error(configAPI);
}

async function getUserInfo(userName){
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`, {
        method: "get",
        headers: {
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID
        }
    })

    if (response.ok) {
        const json = await response.json();

        if(json.data[0] == null){
            return null;
        }
        
        return json.data[0];
    } else {
        errorLog('getUserInfo()', response);
        process.exit(1);
    }
}

async function getUserId(userName) {
    const result = await getUserInfo(userName);

    if(result)
        return result.id;

    return null;
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
        errorLog('banUser()', response);
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
        errorLog('timeoutUser()', response);
        return null;
    }
}

async function deleteChatMessage(messageID){
    const response = await fetch(`https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${configAPI.broadcasterID}&moderator_id=${configAPI.moderatorID}&message_id=${messageID}`, {
        method: "delete",
        headers: {
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID,
        }
    })

    if (response.ok) {
        return true;
    } else {
        errorLog('deleteChatMessage()', response);
        return null;
    }
}

async function shoutout(userName){
    const userID = await getUserId(userName);

    const response = await fetch(`https://api.twitch.tv/helix/chat/shoutouts?from_broadcaster_id=${configAPI.broadcasterID}&to_broadcaster_id=${userID}&moderator_id=${configAPI.moderatorID}`, {
        method: "post",
        headers: {
            "Authorization": `Bearer ${configAPI.authorizationToken}`,
            "Client-Id": configAPI.clientID,
        }
    })

    if (response.ok) {
        return true;
    } else {
        errorLog('shoutout()', response);
        return null;
    }
}

module.exports = { init, getUserInfo, getUserId, banUser, timeoutUser, deleteChatMessage, shoutout }