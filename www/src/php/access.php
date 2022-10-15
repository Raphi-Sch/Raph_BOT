<?php
session_start();

if(!isset($_SESSION['login']) || !$_SESSION['login']){
    header('Location: ./index.php?redirect='.$_SERVER['REQUEST_URI']);
    exit();
}