import {describe, expect, test} from '@jest/globals';
import {parseCommand} from '../tools';

describe('command parser', () => {
    test('command parser return true if prefix is ! and message is !tank', () => {
        expect(parseCommand("!tank", "!")).toBeTruthy();
    });

    test('command parser return true if prefix is !! and message is !!tank', () => {
        expect(parseCommand("!!tank", "!!")).toBeTruthy();
    });

    test('command parser return false if prefix is ! and message is !!tank', () => {
        expect(parseCommand("!!tank", "!")).toBeFalsy();
    });

    test('command parser return false if prefix is ! and message is tank', () => {
        expect(parseCommand("tank", "!")).toBeFalsy();
    });
});