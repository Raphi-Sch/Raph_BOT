import {describe, expect, test} from '@jest/globals';
import {first_of_array} from '../tools';

describe('first of array', () => {
  test('first of empty array return undefined', () => {
    expect(first_of_array([])).toBe(undefined);
  });

  test('first of one value array return first value', () => {
    expect(first_of_array([2])).toBe(2);
  });

  test('first of two values array return first value', () => {
    expect(first_of_array([4, 2])).toBe(4);
  });

  test('first of null return null', () => {
    expect(first_of_array(null)).toBe(null);
  });

  test('first of undefined return null', () => {
    expect(first_of_array(undefined)).toBe(null);
  });

  test('first of not a array return undefined', () => {
    expect(first_of_array(1)).toBe(undefined);
  });
});