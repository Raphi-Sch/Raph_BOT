import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';
import shout from "../../shout/shout";
import shout_runner from "../../shout/shout_runner";

jest.mock('../../shout/shout_runner');

describe('init shout', () => {
  test('init shout with plugin not activate, prepare run function to return null', () => {
    // given
    config.plugin_shout = 2
    // when
    shout.init()
    // then
    expect(shout.run()).toBe(null)
  });

  test('init shout with plugin activate, prepare run function to return shout', () => {
    // given
    config.plugin_shout = 1
    jest.spyOn(shout_runner, 'run_shout').mockReturnValue('foo')
    // when
    shout.init()
    // then
    expect(shout.run()).toBe('foo')
  });
});