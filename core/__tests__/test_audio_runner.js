import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';
import db from "../db";
import tanks from "../command/tanks";
import runner from "../command/commands_runner";
import socket from "../socket";
import tools from "../tools";

describe('run audio', () => {
  test('trigering audio and not excluding it', async () => {
    // given
    const runner = require('../audio/audio_runner');
    const db = require('../db');
    const socket = require('../socket');
    const tools = require('../tools');
    let audio = null;
    jest.spyOn(tools, 'get_random_int').mockReturnValueOnce(5)
    jest.spyOn(db, 'query').mockReturnValueOnce([{frequency: 100, trigger_word: "toto", timeout: 0}])
    jest.spyOn(socket, 'play_audio').mockImplementation(msg => audio = msg.trigger_word)
    // when
    const result = await runner.run_audio({}, 'prenium')
    // then
    expect(audio).toBe("toto")
  });

  test('trigering audio and excluding it', async () => {
    // given
    const runner = require('../audio/audio_runner');
    const db = require('../db');
    const socket = require('../socket');
    const tools = require('../tools');
    let audio = null;
    let msg_in = null;
    let msg_out = null;
    jest.spyOn(tools, 'get_random_int').mockReturnValueOnce(5)
    jest.spyOn(db, 'query').mockReturnValueOnce([{frequency: 100, trigger_word: "toto", timeout: 1, name: 'toto'}])
    jest.spyOn(socket, 'play_audio').mockImplementation(msg => audio = msg.trigger_word)
    jest.spyOn(socket, 'log').mockImplementationOnce(msg => msg_in = msg)
        .mockImplementationOnce(msg => msg_out = msg)
    // when
    const result = await runner.run_audio({}, 'prenium')
    // then
    expect(audio).toBe("toto")
    expect(msg_in).toBe("[AUDIO] toto has been excluded for 1s")
    setTimeout(function (){
      expect(msg_out).toBe("toto")
    }, 1000)
  });
});