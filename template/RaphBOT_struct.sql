-- phpMyAdmin SQL Dump
-- version 5.0.4deb2~bpo10+1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 14 avr. 2023 à 12:56
-- Version du serveur :  10.3.36-MariaDB-0+deb10u2
-- Version de PHP : 7.3.31-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `raphbot`
--

-- --------------------------------------------------------

--
-- Structure de la table `authentication`
--

CREATE TABLE `authentication` (
  `id` int(11) NOT NULL,
  `client` varchar(64) NOT NULL,
  `token` text NOT NULL,
  `expiration` datetime DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `commands`
--

CREATE TABLE `commands` (
  `id` int(11) NOT NULL,
  `command` text NOT NULL,
  `value` text NOT NULL,
  `auto` tinyint(1) NOT NULL,
  `sub_only` tinyint(1) NOT NULL DEFAULT 0,
  `mod_only` tinyint(1) NOT NULL DEFAULT 0,
  `tts` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commands_alias`
--

CREATE TABLE `commands_alias` (
  `id` int(11) NOT NULL,
  `command` text NOT NULL,
  `alias` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commands_audio`
--

CREATE TABLE `commands_audio` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `trigger_word` varchar(20) NOT NULL,
  `volume` float NOT NULL DEFAULT 1,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `timeout` int(11) NOT NULL,
  `file` text NOT NULL,
  `mod_only` tinyint(1) NOT NULL DEFAULT 0,
  `sub_only` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commands_tts_config`
--

CREATE TABLE `commands_tts_config` (
  `id` varchar(30) NOT NULL,
  `value` text DEFAULT NULL,
  `type` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

CREATE TABLE `config` (
  `id` varchar(30) NOT NULL,
  `value` text NOT NULL,
  `hidden` tinyint(1) DEFAULT 0,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `help` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `moderator`
--

CREATE TABLE `moderator` (
  `id` int(11) NOT NULL,
  `trigger_word` text NOT NULL,
  `mod_action` text NOT NULL,
  `explanation` text NOT NULL,
  `duration` int(11) NOT NULL,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `moderator_leet`
--

CREATE TABLE `moderator_leet` (
  `id` int(11) NOT NULL,
  `original` text NOT NULL,
  `replacement` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `moderator_warning`
--

CREATE TABLE `moderator_warning` (
  `id` int(11) NOT NULL,
  `userid` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `datetime_insert` datetime NOT NULL,
  `datetime_update` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `moderator_warning_level`
--

CREATE TABLE `moderator_warning_level` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `action` int(11) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT 0,
  `explanation` text NOT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `trigger_word` varchar(30) NOT NULL,
  `reaction` text NOT NULL,
  `frequency` tinyint(4) NOT NULL,
  `timeout` int(11) NOT NULL,
  `tts` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `shout`
--

CREATE TABLE `shout` (
  `id` int(11) NOT NULL,
  `original` text NOT NULL,
  `replacement` text NOT NULL,
  `language` text DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `tanks`
--

CREATE TABLE `tanks` (
  `id` int(11) NOT NULL,
  `trigger_word` varchar(30) NOT NULL,
  `nation` text NOT NULL,
  `tier` int(2) NOT NULL,
  `name` text NOT NULL,
  `mark` int(1) NOT NULL,
  `max_dmg` int(5) NOT NULL,
  `note` text NOT NULL,
  `type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `tanks_alias`
--

CREATE TABLE `tanks_alias` (
  `alias` varchar(30) NOT NULL,
  `tank` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `tanks_nation`
--

CREATE TABLE `tanks_nation` (
  `alias` varchar(30) NOT NULL,
  `nation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `authentication`
--
ALTER TABLE `authentication`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commands`
--
ALTER TABLE `commands`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commands_alias`
--
ALTER TABLE `commands_alias`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commands_audio`
--
ALTER TABLE `commands_audio`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commands_tts_config`
--
ALTER TABLE `commands_tts_config`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `moderator`
--
ALTER TABLE `moderator`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `moderator_leet`
--
ALTER TABLE `moderator_leet`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `moderator_warning`
--
ALTER TABLE `moderator_warning`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userID` (`userid`);

--
-- Index pour la table `moderator_warning_level`
--
ALTER TABLE `moderator_warning_level`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `shout`
--
ALTER TABLE `shout`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tanks`
--
ALTER TABLE `tanks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tanks_alias`
--
ALTER TABLE `tanks_alias`
  ADD PRIMARY KEY (`alias`);

--
-- Index pour la table `tanks_nation`
--
ALTER TABLE `tanks_nation`
  ADD PRIMARY KEY (`alias`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `authentication`
--
ALTER TABLE `authentication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commands`
--
ALTER TABLE `commands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commands_alias`
--
ALTER TABLE `commands_alias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commands_audio`
--
ALTER TABLE `commands_audio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `moderator`
--
ALTER TABLE `moderator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `moderator_leet`
--
ALTER TABLE `moderator_leet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `moderator_warning`
--
ALTER TABLE `moderator_warning`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `moderator_warning_level`
--
ALTER TABLE `moderator_warning_level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `shout`
--
ALTER TABLE `shout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tanks`
--
ALTER TABLE `tanks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
