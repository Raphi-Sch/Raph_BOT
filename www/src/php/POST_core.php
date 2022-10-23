<?php 

$core_directory = dirname(__DIR__)."/../../core/";

if(isset($_POST) && $_POST['action'] == "start"){
    shell_exec('screen -dmS bot clear; > '.$core_directory.'lastest.log; node '.$core_directory.'core.js > '.$core_directory.'debug.log 2>&1');
}

exit();
