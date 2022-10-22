import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';

describe('run command', () => {

    test('!char run tanks command', async () => {
        // given
        const {config} = require('../../config');
        const runner = require('../../command/commands_runner');
        const db = require('../../db');
        const tanks = require('../../command/tanks');
        config.cmd_prefix = "!"
        jest.spyOn(db, 'query').mockReturnValueOnce([{command: "char"}])
        jest.spyOn(tanks, 'run').mockReturnValueOnce("one tanks")
        // when
        const result = await runner.run_command(null, '!chan 4h')
        // then
        expect(result).toBe("one tanks")
    });

    test('!toto return toto is you @username if no user', async () => {
        // given
        const {config} = require('../../config');
        const runner = require('../../command/commands_runner');
        const db = require('../../db');
        config.cmd_prefix = "!"
        jest.spyOn(db, 'query').mockReturnValueOnce([])
            .mockReturnValueOnce([{value: "toto is you @username"}])
        // when
        const result = await runner.run_command(null, '!toto')
        // then
        expect(result).toBe("toto is you @username")
    });

    test('!toto return toto is you anakin if user-name is anakin', async () => {
        // given
        const {config} = require('../../config');
        const runner = require('../../command/commands_runner');
        const db = require('../../db');
        config.cmd_prefix = "!"
        jest.spyOn(db, 'query').mockReturnValueOnce([{command: "toto"}])
            .mockReturnValueOnce([{value: "toto is you @username"}])
        const user = {}
        user["display-name"] = "anakin"
        // when
        const result = await runner.run_command(user, '!toto')
        // then
        expect(result).toBe("toto is you anakin")
    });

    test('!toto return null there is no command named toto', async () => {
        // given
        const {config} = require('../../config');
        const runner = require('../../command/commands_runner');
        const db = require('../../db');
        config.cmd_prefix = "!"
        jest.spyOn(db, 'query').mockReturnValueOnce([{command: "toto"}])
            .mockReturnValueOnce([])
        const user = {}
        user["display-name"] = "anakin"
        // when
        const result = await runner.run_command(user, '!toto')
        // then
        expect(result).toBe(null)
    });
});