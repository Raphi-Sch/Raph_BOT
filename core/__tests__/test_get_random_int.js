import {describe, expect, test} from '@jest/globals';
import {get_random_int} from '../tools';

describe('get random int', () => {
  test('get_random_int is never greater than max', () => {
    for (let i = 0 ; i < 1000 ; i++) {
      expect(get_random_int(200)).toBeLessThanOrEqual(200);
    }
  });
});