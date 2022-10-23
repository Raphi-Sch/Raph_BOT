import {describe, expect, test, jest} from '@jest/globals';

describe('run shout', () => {
  test('return sentence with replacement', async () => {
    // given
    const db = require('../../db');

    const runner = require('../../shout/shout_runner');
    const user = {"display-name": "anakin"}

    jest.spyOn(db, "query").mockReturnValueOnce([
      {original : 'very', replacement: 'so very'},
      {original : 'it', replacement: 'itt'},
      {original : 's', replacement: 'ss'}
    ])
    // when
    const result = runner.run_shout(user, "it's a very long sentence")
    // then
    expect(result).toBe("AH OUAIS @anakin, ITT'SS A SO VERY LONG SENTENCE !")
  });

  test('return false if sentence is more than 15 words', async () => {
    // given
    const db = require('../../db');

    const runner = require('../../shout/shout_runner');
    const user = {"display-name": "anakin"}

    jest.spyOn(db, "query").mockReturnValueOnce([{original : 'very', replacement: 'so very'}])
    // when
    const result = runner.run_shout(user, "this is a very very very very very very very very very very very very very very very very very very very very long sentence")
    // then
    expect(result).toBeFalsy()
  });
});