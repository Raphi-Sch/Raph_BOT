import {describe, expect, test} from '@jest/globals';
import {randomInt} from '../tools';

describe('get random int', () => {
  test('randomInt is never greater than max', () => {
    for (let i = 0 ; i < 1000 ; i++) {
      expect(randomInt(200)).toBeLessThanOrEqual(200);
    }
  });
});