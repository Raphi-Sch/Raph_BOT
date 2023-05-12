const socket = require("../socket");
const { config } = require("../config");
const tools = require("../tools");
const moderatorAPI = require('./API');
const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

const actionText = ["Ban", "Timeout", "Delete message", "Warning"];
const actionBan = 0;
const actionTimeout = 1;
const actionDelete = 2;
const actionWarn = 3;

async function runModerator(user, message, twitchAPI) {
    const fullCommand = tools.parseCommand(message, config.cmd_prefix);
    if (fullCommand) {
        return command(fullCommand, user, twitchAPI);
    }
    else {
        return checkMessage(user, message, twitchAPI);
    }
}

async function checkMessage(user, message, twitchAPI) {
    const result = await moderatorAPI.checkMessage(message);

    try {
        if (result && result.mod_action) {
            socket.log(`[MODERATOR] Taking action against '${user['display-name']}' for saying '${result.trigger_word}' (Context : '${message}', Action : ${actionText[result.mod_action]}, Duration : ${tools.timeoutToString(result.duration)})`);

            switch (parseInt(result.mod_action)) {
                default:
                    return null;

                case actionBan:
                    twitchAPI.banUser(user['user-id'], result.reason);
                    return result.explanation.replace("@username", user['display-name']);

                case actionTimeout:
                    twitchAPI.timeoutUser(user['user-id'], result.reason, result.duration);
                    return result.explanation.replace("@username", user['display-name']);

                case actionDelete:
                    //twitchAPI.deleteChatMessage(messageID);
                    log('[MODERATOR] Delete message is not implemented yet (not possible with current client)');
                    return true;

                case actionWarn:
                    return warnUser(user['username'], config.twitch_display_name, twitchAPI);
            }
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }

    return null;
}

async function command(command, user, twitchAPI) {
    // Only moderators or broadcaster
    if (user && (user.mod || user.username === config.twitch_channel.toLowerCase())) {
        switch (command[1]) {
            case 'warn':
                return await warnUser(command[2].trim(), user['display-name'], twitchAPI);
        }
    }
    return null;
}

async function warnUser(usernameToWarn, moderator, twitchAPI) {
    const userID = await twitchAPI.getUser(usernameToWarn);

    if (userID !== null) {
        result = await moderatorAPI.warnUser(userID);
        if (result !== null) {
            switch (result.action) {
                case 0:
                    break;
                case 1:
                    twitchAPI.timeoutUser(result.userid, result.reason, result.duration);
                    break;
                case 2:
                    twitchAPI.banUser(result.userid, result.reason);
                    break;
            }

            if (result.explanation) {
                return result.explanation.replace("@username", result.username);
            }

            socket.log(`[MODERATOR-WARN] Taking action against '${result.username}' (Action : ${actionText[result.action]}, Duration : ${tools.timeoutToString(result.duration)})`);

            return true;
        }
    }
    else {
        return `${moderator} : User '${usernameToWarn}' doesn't exist.`;
    }

    return null;
}

module.exports = { runModerator }