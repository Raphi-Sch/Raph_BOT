import {describe, expect, test} from '@jest/globals';
import {normalize_string} from '../tools';

describe('first of array', () => {
    test('first of empty array return undefined', () => {
        expect(normalize_string(" ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçðÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž   "))
            .toBe("aaaaaaaaaaaaooooooøoooooøeeeeeeeeccððiiiiiiiiuuuuuuuunnssyyyzz");
    });
});