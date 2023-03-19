import {describe, expect, test} from '@jest/globals';
import {normalizeString} from '../tools';

describe('first of array', () => {
    test('first of empty array return undefined', () => {
        expect(normalizeString(" ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçðÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž   "))
            .toBe("aaaaaaaaaaaaooooooøoooooøeeeeeeeeccððiiiiiiiiuuuuuuuunnssyyyzz");
    });
});