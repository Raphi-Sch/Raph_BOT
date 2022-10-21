import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';
import moderator from "../moderator/moderator";
describe('init moderator', () => {
  test('init moderator with plugin not activate, prepare run function to return null', () => {
    // given
    const moderator = require('../moderator/moderator');
    config.plugin_moderator = 2
    // when
    moderator.init()
    // then
    expect(moderator.run()).toBe(null)
  });

  test('init moderator with plugin activate, prepare run function to return moderator', () => {
    // given
    const moderator = require('../moderator/moderator');
    const runner = require('../moderator/moderator_runner');
    config.plugin_moderator = 1
    jest.spyOn(runner, 'run_moderator').mockReturnValue('foo')
    // when
    moderator.init()
    // then
    expect(moderator.run()).toBe('foo')
  });
});