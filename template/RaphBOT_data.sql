-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 06 fév. 2023 à 13:10
-- Version du serveur :  10.5.15-MariaDB-0+deb11u1
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `RaphBOT`
--

--
-- Déchargement des données de la table `config`
--

INSERT INTO `config` (`id`, `value`, `hidden`, `type`) VALUES
('bot_name', 'Raph_BOT', 0, 0),
('cmd_msg_interval', '10', 0, 2),
('cmd_prefix', '!', 0, 0),
('cmd_time_interval', '5', 0, 0),
('plugin_audio', '1', 0, 1),
('plugin_commands', '1', 0, 1),
('plugin_moderator', '1', 0, 1),
('plugin_reaction', '1', 0, 1),
('plugin_shout', '1', 0, 1),
('plugin_tanks', '1', 0, 1),
('shout_interval', '10', 0, 0),
('shout_language', 'fr', 0, 0),
('twitch_channel', 'YOUR CHANNEL HERE', 0, 0),
('twitch_connection_message', 'Raph_BOT Greatings', 0, 0),
('twitch_display_name', 'Raph_BOT', 0, 0),
('twitch_token', '', 1, 0);

INSERT INTO `users` (`username`, `password`) VALUES
('admin', NULL);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
