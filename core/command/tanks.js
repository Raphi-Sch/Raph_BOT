const db = require('../db.js')

const tierMin = 5;
const tierMax = 10;

async function query_tier(request) {
    const tier = containsOnlyNumbers(request) ? parseInt(request, 10) : null;
    if (tier) {
        const res = await db.query(`SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
                                FROM tanks
                                WHERE tanks.tier = ?
                                ORDER BY name ASC`, [tier]);

        if (res[0]) {
            return `Char tier ${tier} : ${res[0].value}`;
        }
    }
}

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

async function query_name(request) {
    const res = await db.query(`SELECT DISTINCT name, mark, max_dmg, note
                                FROM tanks, alias_tanks 
                                WHERE (alias_tanks.tank = tanks.trigger_word AND alias_tanks.alias = ?)
                                OR tanks.trigger_word = ?`, [request, request]);

    if (res[0]) {
        return `${res[0].name} : ${res[0].mark} Marque(s) - Dégats max : ${res[0].max_dmg}`;
    }
}

async function query_nation(request) {
    const res = await db.query(`SELECT tanks.nation as nation, GROUP_CONCAT(name SEPARATOR ', ') as value
                                FROM tanks, alias_nation
                                WHERE (alias_nation.nation = tanks.nation AND alias_nation.alias = ?)
                                OR tanks.nation = ?
                                ORDER BY name ASC`, [request, request]);

    if (res[0]) {
        return `Char(s) ${res[0].nation} : ${res[0].value}`;
    }
}

async function query_type(type) {
    const res = await db.query(`SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
                               FROM tanks
                               WHERE tanks.type = ?
                               ORDER BY name ASC`, [type]);

    if (res[0]) {
        return `Char(s) ${type} : ${res[0].value}`;
    }
}

let exclude_tanks = [];

async function query_random() {
    // Get number of Tier 10
    const tier_10 = await db.query(`SELECT COUNT(id) as count FROM tanks WHERE tier = 10`);
    const count = tier_10[0].count;

    // Empty array
    if (exclude_tanks.length === count) exclude_tanks = [];

    let tank_not_in = "";
    if (exclude_tanks.length > 0){
        tank_not_in = `AND id NOT IN (${exclude_tanks.map(() => "?").join(",")})`;
    }
    
    // Random
    const res = await db.query(`SELECT id, name
                               FROM tanks
                               WHERE tier = 10
                               ${tank_not_in}
                               ORDER BY RAND() LIMIT 1`, [exclude_tanks]);

    if (res[0]) {
        exclude_tanks.push(res[0].id)
        return `Voici un char : ${res[0].name}`;
    }
}

async function run(request) {
    if (!request) {
        return `Ecrit "!char 5" pour les chars de tier 5 ou "!char e100" pour les détails du E100, "!char fr" pour les chars Français, ...`;
    }
    if (request < tierMin || request > tierMax) {
        return "Le tier que tu m'as demandé est trop bas ou trop haut (entre " + tierMin + " et " + tierMax + ")";
    }
    if (request === "random") {
        return query_random();
    }
    const tank_by_tier = await query_tier(request);
    if (tank_by_tier) {
        return tank_by_tier;
    }
    const tank_by_nation = await query_nation(request);
    if (tank_by_nation) {
        return tank_by_nation;
    }
    const tank_by_name = await query_name(request);
    if (tank_by_name) {
        return tank_by_name;
    }
    const tank_by_type = await query_type(request);
    if (tank_by_type) {
        return tank_by_type;
    }
    return "Aucun résultat :(";
}

module.exports = { run };