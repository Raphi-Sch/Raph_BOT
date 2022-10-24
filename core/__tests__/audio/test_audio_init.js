import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';
import audio from "../../audio/audio";
import audio_runner from "../../audio/audio_runner";

jest.mock('../../audio/audio_runner')

describe('init audio', () => {
  test('init audio with plugin not activate, prepare run function to return null', () => {
    // given
    config.plugin_audio = 2
    // when
    audio.init()
    // then
    expect(audio.run()).toBe(null)
  });

  test('init audio with plugin activate, prepare run function to return audio', () => {
    // given
    config.plugin_audio = 1
    jest.spyOn(audio_runner, 'run_audio').mockReturnValue('foo')
    // when
    audio.init()
    // then
    expect(audio.run()).toBe('foo')
  });
});