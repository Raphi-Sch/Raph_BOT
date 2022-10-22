import {describe, expect, jest, test} from "@jest/globals";

describe('load config', () => {

    test('load with no db config return the default config', async () => {
        // given
        let exit = 0
        const config = require('../config');
        const db = require('../db');
        jest.spyOn(db, 'query').mockReturnValue(new Promise(resolve => resolve([])))
        jest.spyOn(process, 'exit').mockImplementation(() => exit = 1)
        // when
        await config.load()
        // then
        expect(config.config.bot_name).toBe(null)
        expect(config.config.cmd_msg_interval).toBe(null)
        expect(config.config.cmd_prefix).toBe(null)
        expect(config.config.cmd_time_interval).toBe(null)
        expect(config.config.discord_channel_1).toBe(null)
        expect(config.config.discord_channel_2).toBe(null)
        expect(config.config.discord_notification).toBe(null)
        expect(config.config.discord_token).toBe(null)
        expect(config.config.plugin_audio).toBe(null)
        expect(config.config.plugin_commands).toBe(null)
        expect(config.config.plugin_moderator).toBe(null)
        expect(config.config.plugin_reaction).toBe(null)
        expect(config.config.plugin_shout).toBe(null)
        expect(config.config.shout_interval).toBe(null)
        expect(config.config.twitch_channel).toBe(null)
        expect(config.config.twitch_connection_message).toBe(null)
        expect(config.config.twitch_token).toBe(null)
        expect(exit).toBe(0)
    });

    test('load with db config return the overiding config', async () => {
        // given
        const config = require('../config');
        const db = require('../db');

        const overriding_config = [
            {id: "bot_name", value: 'toto'},
            {id: "cmd_prefix", value: '!'},
            {id: "cmd_time_interval", value: 2},
            {id: "discord_channel_1", value: 'raphi_55'},
            {id: "discord_channel_2", value: 'nyphew_'},
            {id: "discord_token", value: null},
            {id: "plugin_audio", value: 1},
            {id: "plugin_commands", value: 1},
            {id: "plugin_moderator", value: 1},
            {id: "plugin_reaction", value: 1},
            {id: "plugin_shout", value: 1},
            {id: "shout_interval", value: 201},
            {id: "twitch_channel", value: 'raphi_55'},
            {id: "twitch_connection_message", value: 'I am now connected to the matrix'},
            {id: "twitch_token", value: 'auth:sqdjhyfuiohhvcboqdb'}
        ]
        jest.spyOn(db, 'query').mockReturnValue(new Promise(resolve => resolve(overriding_config)))
        // when
        await config.load()
        // then
        expect(config.config.bot_name).toBe('toto')
        expect(config.config.cmd_msg_interval).toBe(null)
        expect(config.config.cmd_prefix).toBe('!')
        expect(config.config.cmd_time_interval).toBe(2)
        expect(config.config.discord_channel_1).toBe('raphi_55')
        expect(config.config.discord_channel_2).toBe('nyphew_')
        expect(config.config.discord_notification).toBe(null)
        expect(config.config.discord_token).toBe(null)
        expect(config.config.plugin_audio).toBe(1)
        expect(config.config.plugin_commands).toBe(1)
        expect(config.config.plugin_moderator).toBe(1)
        expect(config.config.plugin_reaction).toBe(1)
        expect(config.config.plugin_shout).toBe(1)
        expect(config.config.shout_interval).toBe(201)
        expect(config.config.twitch_channel).toBe('raphi_55')
        expect(config.config.twitch_connection_message).toBe('I am now connected to the matrix')
        expect(config.config.twitch_token).toBe('auth:sqdjhyfuiohhvcboqdb')
    });

    test('load with db error exit the program', async () => {
        // given
        let exit = 0
        const config = require('../config');
        const db = require('../db');
        jest.spyOn(db, 'query').mockReturnValue(new Promise(resolve => resolve(null)))
        jest.spyOn(process, 'exit').mockImplementation(() => exit = 1)
        // when
        await config.load()
        // then
        expect(exit).toBe(1)
    });
})
;