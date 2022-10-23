import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';
import commands from "../../command/commands";
import commands_runner from "../../command/commands_runner";

jest.mock('../../command/commands_runner');

describe('init command', () => {
    test('init command with plugin not activate, prepare run function to return null', () => {
        // given
        config.plugin_commands = 2
        // when
        commands.init()
        // then
        expect(commands.run()).toBe(null)
    });

    test('init command with plugin activate, prepare run function to return command', () => {
        // given
        config.plugin_commands = 1
        jest.spyOn(commands_runner, 'run_command').mockReturnValue('foo')
        // when
        commands.init()
        // then
        expect(commands.run()).toBe('foo')
    });
});