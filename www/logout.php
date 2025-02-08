<?php
    session_start();
    unset($_COOKIE['raphbot_api_client']); 
    unset($_COOKIE['raphbot_api_token']); 
    setcookie('raphbot_api_client', '', -1, dirname($_SERVER['PHP_SELF'])); 
    setcookie('raphbot_api_token', '', -1, dirname($_SERVER['PHP_SELF'])); 
    session_destroy();
    header('Location: login.php');
    exit();
