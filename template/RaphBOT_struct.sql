-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 06 fév. 2023 à 13:09
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
-- Base de données : `RaphBOT_DEV`
--

-- --------------------------------------------------------

--
-- Structure de la table `commands`
--

CREATE TABLE `commands` (
  `id` int(11) NOT NULL,
  `command` text NOT NULL,
  `value` text NOT NULL,
  `auto` tinyint(1) NOT NULL DEFAULT 0,
  `mod_only` tinyint(1) NOT NULL DEFAULT 0,
  `sub_only` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commands_alias`
--

CREATE TABLE `commands_alias` (
  `alias` varchar(30) NOT NULL,
  `command` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commands_audio`
--

CREATE TABLE `commands_audio` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `trigger_word` varchar(20) NOT NULL,
  `file` text NOT NULL,
  `volume` float NOT NULL DEFAULT 1,
  `timeout` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `mod_only` tinyint(1) NOT NULL DEFAULT 0,
  `sub_only` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

CREATE TABLE `config` (
  `id` varchar(30) NOT NULL,
  `value` text NOT NULL,
  `hidden` tinyint(1) DEFAULT 0,
  `type` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `moderator`
--

CREATE TABLE `moderator` (
  `id` int(11) NOT NULL,
  `trigger_word` text NOT NULL,
  `mod_action` text NOT NULL,
  `explanation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `trigger_word` varchar(30) NOT NULL,
  `reaction` text NOT NULL,
  `frequency` int(11) NOT NULL,
  `timeout` int(11) NOT NULL
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
-- Index pour la table `commands`
--
ALTER TABLE `commands`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commands_alias`
--
ALTER TABLE `commands_alias`
  ADD PRIMARY KEY (`alias`);

--
-- Index pour la table `commands_audio`
--
ALTER TABLE `commands_audio`
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
-- AUTO_INCREMENT pour la table `commands`
--
ALTER TABLE `commands`
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
