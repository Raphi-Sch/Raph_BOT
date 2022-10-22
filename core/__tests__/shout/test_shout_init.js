import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';

describe('init shout', () => {
  test('init shout with plugin not activate, prepare run function to return null', () => {
    // given
    const shout = require('../../shout/shout');
    config.plugin_shout = 2
    // when
    shout.init()
    // then
    expect(shout.run()).toBe(null)
  });

  test('init shout with plugin activate, prepare run function to return shout', () => {
    // given
    const shout = require('../../shout/shout');
    const runner = require('../../shout/shout_runner');
    config.plugin_shout = 1
    jest.spyOn(runner, 'run_shout').mockReturnValue('foo')
    // when
    shout.init()
    // then
    expect(shout.run()).toBe('foo')
  });
});