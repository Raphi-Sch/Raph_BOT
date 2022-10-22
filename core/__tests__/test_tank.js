import {describe, expect, jest, test} from "@jest/globals";

describe('tank request', () => {

    test('default awnser if request is null', async () => {
        // given
        const tanks = require('../command/tanks');
        // when
        const result = await tanks.run(null)
        // then
        expect(result).toBe(`Ecrit "!char 5" pour les chars de tier 5 ou "!char e100" pour les détails du E100, "!char fr" pour les chars Français, ...`)
    });

    test('default tier awnser if request is lower than the minimum tier', async () => {
        // given
        const tanks = require('../command/tanks');
        // when
        const result = await tanks.run(1)
        // then
        expect(result).toBe("Le tier que tu m'as demandé est trop bas ou trop haut (entre 5 et 10)")
    });

    test('default tier awnser if request is greater than the minimum tier', async () => {
        // given
        const tanks = require('../command/tanks');
        // when
        const result = await tanks.run(11)
        // then
        expect(result).toBe("Le tier que tu m'as demandé est trop bas ou trop haut (entre 5 et 10)")
    });

    // TODO - to do as an integration test when we begin the CI
    test('random request should return a random tank', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([{count: 2}])))
            .mockReturnValueOnce(new Promise(resolve => resolve([{id:"1234", name: "Tiger 1"}])))
        // when
        const result = await tanks.run("random")
        // then
        expect(result).toBe("Voici un char : Tiger 1")
    });

    test('get all tanks of a tier if request is a number between 5 and 10', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([{value: "Mause, G.W. E 100"}])))
        // when
        const result = await tanks.run(10)
        // then
        expect(result).toBe("Char tier 10 : Mause, G.W. E 100")
    });

    test('get all tanks of a nation if request is a nation', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([{nation: "allemand", value: "Mause, G.W. E 100"}])))
        // when
        const result = await tanks.run("de")
        // then
        expect(result).toBe("Char(s) allemand : Mause, G.W. E 100")
    });

    test('get all stat of a tank if request is a tank', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([{
                name: "PZ.KPFW. IV HYDROSTAT.",
                mark: 3,
                max_dmg: 4510,
                note: "mon petit bébé"
            }])))
        // when
        const result = await tanks.run("IV H")
        // then
        expect(result).toBe("PZ.KPFW. IV HYDROSTAT. : 3 Marque(s) - Dégats max : 4510")
    });

    test('get all stat of a tank if request is a tank', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([{
                name: "PZ.KPFW. IV HYDROSTAT.",
                mark: 3,
                max_dmg: 4510,
                note: "mon petit bébé"
            }])))
        // when
        const result = await tanks.run("4H")
        // then
        expect(result).toBe("PZ.KPFW. IV HYDROSTAT. : 3 Marque(s) - Dégats max : 4510")
    });

    test('get all tanks of a type if request is a type', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([{value: "Mause, T57 HEAVY TANK"}])))
        // when
        const result = await tanks.run("lourd")
        // then
        expect(result).toBe("Char(s) lourd : Mause, T57 HEAVY TANK")
    });

    test('no result if no matched request', async () => {
        // given
        const tanks = require('../command/tanks');
        const db = require('../db');
        jest.spyOn(db, 'query')
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
            .mockReturnValueOnce(new Promise(resolve => resolve([])))
        // when
        const result = await tanks.run("toto")
        // then
        expect(result).toBe("Aucun résultat :(")
    });
});