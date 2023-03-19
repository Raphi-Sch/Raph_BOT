const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getBroadcasterId(broadcasterName, clientID, authorizationToken) {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${broadcasterName}`, {
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
        console.error("[TWITCH API] Error while executing function getBroadcasterId() - HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        process.exit(1);
    }
}

async function banUser(broadcasterID, clientID, authorizationToken, userID, reason) {
    const body = {
        data: [
            {
                user_id: userID,
                reason: reason
            }
        ]
    }

    const response = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${broadcasterID}&moderator_id=${clientID}`, {
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
        console.error("[TWITCH API] Error while executing function banUser() - HTTP ERROR : " + response.status + " (" + response.statusText + ")");
        return null;
    }
}

module.exports = { getBroadcasterId, banUser }