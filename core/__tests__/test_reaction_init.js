import {describe, expect, test, jest} from '@jest/globals';
import {config} from '../config';

describe('init reaction', () => {
  test('init reaction with plugin not activate, prepare run function to return null', () => {
    // given
    const reaction = require('../reaction/reaction');
    config.plugin_reaction = 2
    // when
    reaction.init()
    // then
    expect(reaction.run()).toBe(null)
  });

  test('init reaction with plugin activate, prepare run function to return reaction', () => {
    // given
    const reaction = require('../reaction/reaction');
    const runner = require('../reaction/reaction_runner');
    config.plugin_reaction = 1
    jest.spyOn(runner, 'run_reaction').mockReturnValue('foo')
    // when
    reaction.init()
    // then
    expect(reaction.run()).toBe('foo')
  });
});