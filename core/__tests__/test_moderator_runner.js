import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';
import db from "../db";
import socket from "../socket";
import runner from "../moderator/moderator_runner";

describe('run moderator', () => {

    test('premium is a ban word on the chat', async () => {
        // given
        const runner = require('../moderator/moderator_runner');
        const db = require('../db');
        const socket = require('../socket');
        let log = null;
        jest.spyOn(db, 'query').mockReturnValueOnce([{mod_action: "ban @username", explanation: "you can not use this word"}])
        jest.spyOn(socket, 'log').mockImplementation(msg => log = msg)

        const user = {}
        user["display-name"] = "anakin"
        // when
        const result = await runner.run_moderator(user, 'prenium')
        // then
        expect(result.mod_action).toBe("ban anakin")
        expect(result.explanation).toBe("you can not use this word")
        expect(log).toBe("[MODERATOR] Taking action against anakin for saying prenium (Action : ban @username )")
    });

    test('premium is not a ban word on the chat', async () => {
        // given
        const runner = require('../moderator/moderator_runner');
        const db = require('../db');
        const socket = require('../socket');
        let log = null;
        jest.spyOn(db, 'query').mockReturnValueOnce([])
        jest.spyOn(socket, 'log').mockImplementation(msg => log = msg)

        const user = {}
        user["display-name"] = "anakin"
        // when
        const result = await runner.run_moderator(user, 'prenium')
        // then
        expect(result).toBe(undefined)
        expect(log).toBe(null)
    });

    test('socket crached', async () => {
        // given
        const runner = require('../moderator/moderator_runner');
        const db = require('../db');
        const socket = require('../socket');
        jest.spyOn(db, 'query').mockReturnValueOnce([{mod_action: "ban @username", explanation: "you can not use this word"}])
        jest.spyOn(socket, 'log').mockImplementation(msg => null.dd)

        const user = {}
        user["display-name"] = "anakin"
        // when
        const result = await runner.run_moderator(user, 'prenium')
        // then
        expect(result).toBe(null)
    });
});