const socket = require("../socket");
const { config } = require("../config");
const tools = require("../tools");
const actionText = ["Ban", "Timeout", "Delete message"];
const moderatorAPI = require('./API');

const { re } = require("@babel/core/lib/vendor/import-meta-resolve");

async function runModerator(user, message, twitchAPI) {
    const fullCommand = tools.parseCommand(message, config.cmd_prefix);
    if(fullCommand){
        return command(fullCommand, user, message, twitchAPI);
    }
    else{
        return checkMessage(user, message, twitchAPI);
    }
}

async function checkMessage(user, message, twitchAPI){
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
}

async function command(command, user, message, twitchAPI){
    switch(command[1]){
        case 'warn':
            return await warnUser(command, twitchAPI);
    }

    return null;
}

async function warnUser(command, twitchAPI){
    const user = await twitchAPI.getUserInfo(command[2]);

    if(user !== null)
        result = await moderatorAPI.warnUser(user);

    return `${result.user} this is your ${result.count} warning, be careful !`;
}

module.exports = { runModerator }