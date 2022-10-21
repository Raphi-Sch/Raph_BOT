import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';

describe('init command', () => {
  test('init command with plugin not activate, prepare run function to return null', () => {
    // given
    const command = require('../command/commands');
    config.plugin_commands = 2
    // when
    command.init()
    // then
    expect(command.run()).toBe(null)
  });

  test('init command with plugin activate, prepare run function to return command', () => {
    // given
    const command = require('../command/commands');
    const runner = require('../command/commands_runner');
    config.plugin_commands = 1
    jest.spyOn(runner, 'run_command').mockReturnValue('foo')
    // when
    command.init()
    // then
    expect(command.run()).toBe('foo')
  });
});