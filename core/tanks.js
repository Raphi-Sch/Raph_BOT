const db = require('./db.js');

const tierMin = 5;
const tierMax = 10;

async function query_tier(request) {
    const tier = parseInt(request);
    if (tier) {
        const res = await db.query(`SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
                                FROM tanks
                                WHERE tanks.tier = ?
                                ORDER BY name ASC`, [tier]);
        return first(res, tank => "Tier " + tier + " : " + tank.value)
    }
}

async function query_name(request) {
    const res = await db.query(`SELECT name, mark, max_dmg, note
                                FROM tanks
                                INNER JOIN alias_tanks ON alias_tanks.tank = tanks.trigger_word
                                AND alias_tanks.alias = ?`, [request]);
    return first(res, tank => `${tank.name} : ${tank.mark} Marque(s) - Dégats max : ${tank.max_dmg}`)
}

async function query_nation(request) {
        const res = await db.query(`SELECT tanks.nation as nation, GROUP_CONCAT(name SEPARATOR ', ') as value
                               FROM tanks
                               INNER JOIN alias_nation ON alias_nation.nation = tanks.nation
                               AND alias_nation.alias = ?
                               ORDER BY name ASC`, [request]);
        return first(res, x => "Char(s) " + x.nation + " : " + x.value)
}

async function query_type(type) {
    const res = await db.query(`SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
                               FROM tanks
                               WHERE tanks.type = ?
                               ORDER BY name ASC`, [type]);
    return first(res, x => "Char(s) " + type + " : " + x.value)
}

let exclude_tanks = [];

async function query_random() {
    let count = 0;

    // Get number of Tier 10
    const tier_10 = await db.query(`SELECT COUNT(id) as count FROM tanks WHERE tier = 10`);
    first(tier_10, x => count = x.count)

    // Empty array
    if (exclude_tanks.length === count) exclude_tanks = [];

    const tank_not_in = exclude_tanks.map(() => "?").join(",")
    // Random
    const res = await db.query(`SELECT id, name
                               FROM tanks
                               WHERE tier = 10
                               AND id NOT IN (${tank_not_in})
                               ORDER BY RAND() LIMIT 1`, [exclude_tanks]);
    return first(res, x => {
        exclude_tanks.push(x.id)
        return x.name
    })
}

async function hangar(request) {
    if (!request) {
        return `Ecrit "!char 5" pour les chars de tier 5 ou "!char e100" pour les détails du E100, "!char fr" pour les chars Français, ...`;
    }
    if (request < tierMin || request > tierMax) {
        return "Le tier que tu m'as demandé est trop bas ou trop haut (entre " + tierMin + " et " + tierMax + ")";
    }
    if (request === "random") {
        return "Voici un char : " + await query_random();
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
        return "Char(s) " + request + " : " + tank_by_type;
    }
    return "Aucun résultat :(";
}

function first(tab, data_to_get) {
    if (data_to_get === undefined) {
        data_to_get = x => x
    }
    try {
        if (tab[0]) {
            return data_to_get(tab[0]);
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {hangar};
