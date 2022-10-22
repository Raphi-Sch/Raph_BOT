import {describe, expect, jest, test} from "@jest/globals";


describe('time trigger', () => {
  test('no message triger if only 1 message send and you need to send 2 message to triger a massage', async () => {
    // given
    const db = require('../../db');
    const command = require('../../command/commands');
    const {config} = require('../../config');
    const runner = require('../../command/commands_runner');
    command.reboot_timer()
    config.plugin_commands = 1
    config.cmd_prefix = "!"
    config.cmd_time_interval = 2
    command.init()
    jest.spyOn(db, "query").mockReturnValue([{command: "toto"}])
    jest.spyOn(runner, 'run_command').mockImplementation((user, msg) => msg)
    // when
    const result = await command.time_trigger()
    // then
    expect(result).toBe(null)
  });

  test('message triger if only 1 message send and you need to send 1 message to triger a massage', async () => {
    // given
    const db = require('../../db');
    const command = require('../../command/commands');
    const {config} = require('../../config');
    const runner = require('../../command/commands_runner');
    command.reboot_timer()
    config.plugin_commands = 1
    config.cmd_prefix = "!"
    config.cmd_time_interval = 1
    command.init()
    jest.spyOn(db, "query").mockReturnValue([{command: "toto"}])
    jest.spyOn(runner, 'run_command').mockImplementation((user, msg) => msg)
    // when
    const result = await command.time_trigger()
    // then
    expect(result).toBe("!toto")
  });
});