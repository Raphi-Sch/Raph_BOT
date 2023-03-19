import {describe, expect, test, jest} from '@jest/globals';
import db from "../../db";

describe('run reaction', () => {
  test('trigering reaction and not excluding it', async () => {
    // given
    const runner = require('../../reaction/reaction_runner');
    const db = require('../../db');
    const socket = require('../../socket');
    const tools = require('../../tools');
    let audio = null;
    jest.spyOn(tools, 'randomInt').mockReturnValueOnce(5)
    jest.spyOn(db, 'query').mockReturnValueOnce([{frequency: 100, reaction: "xxx", trigger_word: "toto", timeout: 1}])
    jest.spyOn(socket, 'playAudio').mockImplementation(msg => audio = msg.trigger_word)
    // when
    await runner.runReaction({}, 'prenium')
    const result = await runner.runReaction({}, 'prenium')
    // then
    expect(result).toBe(undefined)
  });

  test('trigering reaction and excluding it', async () => {
    // given
    const runner = require('../../reaction/reaction_runner');
    const db = require('../../db');
    const socket = require('../../socket');
    const tools = require('../../tools');
    let msg_in = null;
    jest.spyOn(tools, 'randomInt').mockReturnValueOnce(5)
    jest.spyOn(db, 'query').mockReturnValueOnce([{frequency: 100, reaction: "xxx", trigger_word: "toto", timeout: 1}])
    jest.spyOn(socket, 'log').mockImplementationOnce(msg => msg_in = msg)
    // when
    const result = await runner.runReaction({}, 'prenium')
    // then
    expect(msg_in).toBe("[REACTION] toto has been excluded for 1s")
    expect(result).toBe("xxx")
  });

  test('socket crached', async () => {
    // given
    const runner = require('../../reaction/reaction_runner');
    const tools = require('../../tools');
    jest.spyOn(db, 'query').mockReturnValueOnce([{frequency: 100, reaction: "xxx", trigger_word: "toto", timeout: 1}])
    jest.spyOn(tools, 'randomInt').mockImplementation(msg => null.dd)
    // when
    const result = await runner.runReaction({}, 'prenium')
    // then
    expect(result).toBe(null)
  });
});