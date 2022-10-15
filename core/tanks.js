const db = require('./db.js');

const tierMin = 5;
const tierMax = 10;

var exclude_tanks = [];

async function query_tier(tier){
    var res = await db.query("SELECT GROUP_CONCAT(name SEPARATOR ', ') as value FROM tanks WHERE tanks.tier='" + tier + "' ORDER BY name ASC");

    try {
        if(res){
            return res[0].value;
        }
        return;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function query_name(name){
    var res = await db.query("SELECT name, mark, max_dmg, note FROM tanks WHERE tanks.key='" + name + "'");

    try {
        if(res[0]){
            tank = res[0];
            return tank.name + ' : ' + tank.mark + ' Marque(s) - Dégats max : ' + tank.max_dmg;
        }
        return;
    }
    catch (err){
        console.error(err);
        return;
    }
}

async function query_nation(nation){
    var res = await db.query("SELECT GROUP_CONCAT(name SEPARATOR ', ') as value FROM tanks WHERE tanks.nation='" + nation + "' ORDER BY name ASC");

    try {
        if(res[0]){
            return res[0].value;
        }
        return;
    }
    catch (err){
        console.error(err);
        return;
    }
}

async function query_type(type){
    var res = await db.query("SELECT GROUP_CONCAT(name SEPARATOR ', ') as value FROM tanks WHERE tanks.type='" + type + "' ORDER BY name ASC");

    try {
        if(res[0]){
            return res[0].value;
        }
        return;
    }
    catch (err){
        console.error(err);
        return;
    }
}

async function query_random(){
    var count = 0;

    // Get number of Tier 10
    var res = await db.query("SELECT COUNT(`key`) as count FROM tanks WHERE tier = 10");
    try {
        if(res[0]){
            count = res[0].count;
        }
    }
    catch (err){
        console.error(err);
        return;
    }

    // Empty array
    if(exclude_tanks.length == count) exclude_tanks = [];
    
    // Exclude tank
    var sql_exclude = "";
    exclude_tanks.forEach(tank => sql_exclude += " AND `key` != '" + tank + "'");
    
    // Random
    var res = await db.query("SELECT `key`, `name` FROM tanks WHERE tier = 10 " + sql_exclude + " ORDER BY RAND() LIMIT 1");
    try {
        if(res[0]){
            exclude_tanks.push(res[0].key);
            return res[0].name;
        }
        return;
    }
    catch (err){
        console.error(err);
        return;
    }
}

async function get_alias_name(request){
    var res = await db.query("SELECT tank FROM alias_tanks WHERE alias_tanks.alias='" + request + "'");

    try {
        if(res[0]){
            return res[0].tank;
        }
        return;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function get_alias_nation(request){
    var res = await db.query("SELECT nation FROM alias_nation WHERE alias_nation.alias='" + request + "'");

    try {
        if(res[0]){
            return res[0].nation;
        }
        return;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function hangar(request){
    var result = null;

    // Param is not defined or out of range
    if(!request){
        return "Ecrit \"!char 5\" pour les chars de tier 5 ou \"!char e100\" pour les détails du E100, \"!char fr\" pour les chars Français, ...";
    }

    // Param is out of range
	if(request < tierMin || request > tierMax){
		return "Le tier que tu m'as demandé est trop bas ou trop haut (entre " + tierMin + " et " + tierMax + ")";
    }

    // request = random
    if(request == "random"){
        return "Voici un char : " + await query_random();
    }
    
    // request is a tier
	var param_tier = parseInt(request);
	if(param_tier){
		result = await query_tier(param_tier);
        
        if(result){
            return "Tier " + param_tier + " : " + result;
        }
    }
    
	// request is a Nation
	// Alias
	var nation = await get_alias_nation(request);
	if(nation){
		request = nation;
	}

    result = await query_nation(request);
	if (result){
		return "Char(s) " + request + " : " + result;
	}
    
    // request is a tank
	// Alias
	var tank = await get_alias_name(request);
	if(tank){
        request = tank
    }

    result = await query_name(request);
    if (result){
        return result;
    }

    // request is a type
    result = await query_type(request);
    if (result){
        return "Char(s) " + request + " : " + result;
    }

    // IDK
    return "Aucun résultat :(";
}

module.exports = {hangar};