import {describe, expect, test} from '@jest/globals';
import {command_parser} from '../tools';

describe('command parser', () => {
    test('command parser return true if prefix is ! and message is !tank', () => {
        expect(command_parser("!tank", "!")).toBeTruthy();
    });

    test('command parser return true if prefix is !! and message is !!tank', () => {
        expect(command_parser("!!tank", "!!")).toBeTruthy();
    });

    test('command parser return false if prefix is ! and message is !!tank', () => {
        expect(command_parser("!!tank", "!")).toBeFalsy();
    });

    test('command parser return false if prefix is ! and message is tank', () => {
        expect(command_parser("tank", "!")).toBeFalsy();
    });
});