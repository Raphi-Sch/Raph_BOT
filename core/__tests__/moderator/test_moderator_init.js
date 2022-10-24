import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';
import moderator from "../../moderator/moderator";
import moderator_runner from "../../moderator/moderator_runner";

jest.mock('../../moderator/moderator_runner');

describe('init moderator', () => {
  test('init moderator with plugin not activate, prepare run function to return null', () => {
    // given
    config.plugin_moderator = 2
    // when
    moderator.init()
    // then
    expect(moderator.run()).toBe(null)
  });

  test('init moderator with plugin activate, prepare run function to return moderator', () => {
    // given
    config.plugin_moderator = 1
    jest.spyOn(moderator_runner, 'run_moderator').mockReturnValue('foo')
    // when
    moderator.init()
    // then
    expect(moderator.run()).toBe('foo')
  });
});
