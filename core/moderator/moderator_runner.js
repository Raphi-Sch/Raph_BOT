const socket = require("../socket");
const { config } = require("../config");
const tools = require("../tools");
const actionText = ["Ban", "Timeout", "Delete message"];
const moderatorAPI = require('./API');

const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

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
                case 0:
                    twitchAPI.banUser(user['user-id'], result.reason);
                    break;
                case 1:
                    twitchAPI.timeoutUser(user['user-id'], result.reason, result.duration);
                    break;
                case 2:
                    //twitchAPI.deleteChatMessage(messageID);
                    log('[MODERATOR] Delete message is not implemented yet (not possible with current client)');
                    break;
            }

            result.explanation = result.explanation.replace("@username", user['display-name']);
            return result.explanation;
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
                return await warnUser(command, user, twitchAPI);
        }
    }
    return null;
}

async function warnUser(command, moderator, twitchAPI) {
    const userInput = command[2].trim();
    const user = await twitchAPI.getUser(userInput);

    if (user !== null) {
        result = await moderatorAPI.warnUser(user);
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
                result.explanation = result.explanation.replace("@username", result.username);
                return result.explanation;
            }
            return true;
        }
    }
    else {
        return `${moderator['display-name']} : User '${userInput}' doesn't exist.`;
    }

    return null;
}

module.exports = { runModerator }