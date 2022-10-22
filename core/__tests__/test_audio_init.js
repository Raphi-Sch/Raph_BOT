import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';

describe('init audio', () => {
  test('init audio with plugin not activate, prepare run function to return null', () => {
    // given
    const audio = require('../audio/audio');
    config.plugin_audio = 2
    // when
    audio.init()
    // then
    expect(audio.run()).toBe(null)
  });

  test('init audio with plugin activate, prepare run function to return audio', () => {
    // given
    const audio = require('../audio/audio');
    const runner = require('../audio/audio_runner');
    config.plugin_audio = 1
    jest.spyOn(runner, 'run_audio').mockReturnValue('foo')
    // when
    audio.init()
    // then
    expect(audio.run()).toBe('foo')
  });
});