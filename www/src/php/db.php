<?php

function db_connect()
{
    $config_JSON = json_decode(file_get_contents("../config.json"), true);

    $db = mysqli_connect($config_JSON["db_host"], $config_JSON["db_user"], $config_JSON["db_pass"], $config_JSON["db_name"]);
    mysqli_set_charset($db, "utf8");
    /* check connection */
    if (mysqli_connect_errno()) {
        echo "<h2>SQL Error : " . mysqli_connect_error() . "</h2>";
        exit();
    }

    return $db;
}

function query_error($db, $request)
{
    echo "SQL Error : " . mysqli_error($db);
    error_log("SQL : " . $request);
    exit(1);
}

function db_query_raw($db, $request)
{
    $res = mysqli_query($db, $request);

    if (mysqli_error($db)) {
        query_error($db, $request);
    }

    return $res;
}

function sanitise_input($db, $string)
{
    $string = trim($string);
    $string = mysqli_real_escape_string($db, $string);
    return $string;
}

function query_error_prepared($db, $query, $parameters_types, $parameters)
{
    echo "SQL Error : " . mysqli_error($db);
    error_log(mysqli_error($db));
    error_log("SQL Query : " . $query);
    error_log("SQL Param type :" . $parameters_types);
    error_log("SQL Params :" . $parameters);
    exit(1);
}

function db_query_prepared_no_result($db, $query, $parameters_types, $parameters)
{
    $query_exec = $db->prepare($query);

    if (!is_null($parameters)) {
        if (is_array($parameters))
            $query_exec->bind_param($parameters_types, ...$parameters);
        else
            $query_exec->bind_param($parameters_types, $parameters);
    }

    $query_exec->execute();
    $query_exec->close();

    if (mysqli_error($db)) {
        query_error_prepared($db, $query, $parameters_types, $parameters);
    }
}

function db_query_prepared($db, $query, $parameters_types, $parameters)
{
    $query_exec = $db->prepare($query);

    if (!is_null($parameters)) {
        if (is_array($parameters))
            $query_exec->bind_param($parameters_types, ...$parameters);
        else
            $query_exec->bind_param($parameters_types, $parameters);
    }

    $query_exec->execute();

    if (mysqli_error($db)) {
        query_error_prepared($db, $query, $parameters_types, $parameters);
    }

    return $query_exec->get_result()->fetch_assoc();
}

function db_query_prepared_raw($db, $query, $parameters_types, $parameters)
{
    $query_exec = $db->prepare($query);

    if (!is_null($parameters)) {
        if (is_array($parameters))
            $query_exec->bind_param($parameters_types, ...$parameters);
        else
            $query_exec->bind_param($parameters_types, $parameters);
    }

    $query_exec->execute();

    if (mysqli_error($db)) {
        query_error_prepared($db, $query, $parameters_types, $parameters);
    }

    return $query_exec->get_result();
}
