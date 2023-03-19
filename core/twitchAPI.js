const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getUserId(userName, clientID, authorizationToken) {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`, {
        method: "get",
        headers: {
            "Authorization": `Bearer ${authorizationToken}`,
            "Client-Id": clientID
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

async function banUser(broadcasterID, botID, clientID, authorizationToken, userID, reason) {
    const body = {
        data: [
            {
                user_id: userID,
                reason: reason
            }
        ]
    }

    const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${broadcasterID}&moderator_id=${botID}`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`,
            "Client-Id": clientID
        }
    })

    if (response.ok) {
        return true;
    } else {
        console.error("[TWITCH API] Error while executing function banUser() -> HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        return null;
    }
}

module.exports = { getUserId, banUser }