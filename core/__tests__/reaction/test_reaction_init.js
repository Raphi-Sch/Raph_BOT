import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../../config';
import reaction from "../../reaction/reaction";
import reaction_runner from "../../reaction/reaction_runner";

jest.mock('../../reaction/reaction_runner');

describe('init reaction', () => {
  test('init reaction with plugin not activate, prepare run function to return null', () => {
    // given
    config.plugin_reaction = 2
    // when
    reaction.init()
    // then
    expect(reaction.run()).toBe(null)
  });

  test('init reaction with plugin activate, prepare run function to return reaction', () => {
    // given
    config.plugin_reaction = 1
    jest.spyOn(reaction_runner, 'runReaction').mockReturnValue('foo')
    // when
    reaction.init()
    // then
    expect(reaction.run()).toBe('foo')
  });
});