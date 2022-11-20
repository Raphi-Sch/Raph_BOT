<?php

const TIER_MIN = 5;
const TIER_MAX = 10;

function get_name($db, $request)
{
    $query = "SELECT DISTINCT `name`, mark, max_dmg, note 
        FROM tanks LEFT JOIN alias_tanks ON alias_tanks.tank = tanks.trigger_word
        WHERE alias_tanks.alias = ? OR tanks.trigger_word = ?";

    $result = db_query($db, $query, "ss", [$request, $request]);

    if (empty($result['name']))
        return null;
    else
        return $result['name'] . " : " . $result['mark'] . " marque(s) - Dégats max : " . $result['max_dmg'];
}

function get_type($db, $request)
{
    $query = "SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks
        WHERE tanks.type = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "s", $request);

    if (empty($result['value']))
        return null;
    else
        return "Char(s) " . $request . " : " . $result['value'];
}

function get_tier($db, $request)
{
    $query = "SELECT GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks
        WHERE tanks.tier = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "i", $request);

    if (empty($result['value']))
        return null;
    else
        return "Char(s) tier " . $request . " : " . $result['value'];
}

function get_nation($db, $request)
{
    $query = "SELECT tanks.nation as nation, GROUP_CONCAT(name SEPARATOR ', ') as value
        FROM tanks LEFT JOIN alias_nation ON alias_nation.nation = tanks.nation
        WHERE alias_nation.alias = ? OR tanks.nation = ?
        ORDER BY name ASC";

    $result = db_query($db, $query, "ss", [$request, $request]);

    if (empty($result['value']))
        return null;
    else
        return "Char(s) " . $result['nation'] . " : " . $result['value'];
}

function get_random($db, $excluded_tanks)
{
    $count = db_query($db, "SELECT COUNT(id) as count FROM tanks WHERE tier = 10")['count'];
    $SQL_params_type = "";

    // Build tanks not in
    $tanks_not_in = "";
    $tanks_not_in_count = count($excluded_tanks);
    if ($tanks_not_in_count > 0) {
        $tanks_not_in = "AND id NOT IN (" . join(',', array_fill(0, $tanks_not_in_count, '?')) . ")";
        $SQL_params_type .= str_repeat('s', $tanks_not_in_count);
    }

    // Query
    $SQL_query = "SELECT id, name FROM tanks WHERE tier = 10 " . $tanks_not_in . " ORDER BY RAND() LIMIT 1";

    $result = db_query($db, $SQL_query, $SQL_params_type, $excluded_tanks);

    return ['value' => "@username Voici un char : " . $result['name'], 'exclude' => $result['id'], 'total' => $count, 'char_random' => true];
}

function run_tank(mysqli $db, string $param, array $excluded_tanks = null)
{
    if (empty($param)) {
        return ['value' => "@username Ecrit \"!char 5\" pour les chars de tier 5 ou \"!char e100\" pour les détails du E100, \"!char fr\" pour les chars Français, ..."];
    }

    if (intval($param) != 0 && (intval($param) < TIER_MIN || intval($param) > TIER_MAX)) {
        return ['value' => "@username Le tier que tu m'as demandé est trop bas ou trop haut (entre " . TIER_MIN . " et " . TIER_MAX . ")"];
    }

    if ($param == "random") {
        return get_random($db, $excluded_tanks);
    }

    $tank_by_tier = get_tier($db, $param);
    if (!empty($tank_by_tier)) {
        return ['value' => "@username " . $tank_by_tier];
    }

    $tank_by_nation = get_nation($db, $param);
    if (!empty($tank_by_nation)) {
        return ['value' => "@username " . $tank_by_nation];
    }

    $tank_by_name = get_name($db, $param);
    if (!empty($tank_by_name)) {
        return ['value' => "@username " . $tank_by_name];
    }

    $tank_by_type = get_type($db, $param);
    if (!empty($tank_by_type)) {
        return ['value' => "@username " . $tank_by_type];
    }
}
