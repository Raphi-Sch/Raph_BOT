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
('cmd_time_interval', '5', 0, 2),
('debug_level', '1', 0, 2),
('force_gui_update', '30', 0, 2),
('plugin_audio', '1', 0, 1),
('plugin_commands', '1', 0, 1),
('plugin_moderator', '1', 0, 1),
('plugin_reaction', '1', 0, 1),
('plugin_shout', '1', 0, 1),
('plugin_tanks', '1', 0, 1),
('shout_interval', '10', 0, 2),
('shout_language', 'fr', 0, 0),
('twitch_channel', 'YOUR CHANNEL HERE', 0, 0),
('twitch_client_id', 'AUTH ID', 1, 0),
('twitch_connection_message', 'Raph_BOT Greatings', 0, 0),
('twitch_display_name', 'Raph_BOT', 0, 0),
('twitch_redirect_uri', 'http://<web_server>/www/config.php', 0, 0),
('twitch_scope', 'chat:edit+chat:read+moderator:manage:banned_users+moderator:manage:chat_messages+user:read:follows+moderator:manage:shoutouts', 0, 0),
('twitch_token', '', 1, 0);

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('admin', NULL);

--
-- Déchargement des données de la table `moderator_leet`
--

INSERT INTO `moderator_leet` (`id`, `original`, `replacement`) VALUES
(1, '4', 'a'),
(2, '/\\', 'a'),
(3, '@', 'a'),
(4, '^', 'a'),
(5, 'aye', 'a'),
(6, '∂', 'a'),
(7, '/-\\', 'a'),
(8, '|-\\', 'a'),
(9, 'q ', 'a'),
(10, '8', 'b'),
(11, '6', 'b'),
(12, '13', 'b'),
(13, '|3', 'b'),
(14, 'ß', 'b'),
(15, 'P>', 'b'),
(16, '|:', 'b'),
(17, '!3', 'b'),
(18, '(3', 'b'),
(19, '/3', 'b'),
(20, ')3', 'b'),
(21, '(', 'c'),
(22, '¢', 'c'),
(23, '<', 'c'),
(24, '[', 'c'),
(25, '© ', 'c'),
(26, '[)', 'd'),
(27, '|o', 'd'),
(28, ')', 'd'),
(29, 'I>', 'd'),
(30, '|>', 'd'),
(31, ' ?', 'd'),
(32, 'T)', 'd'),
(33, '|)', 'd'),
(34, '0', 'd'),
(35, '</', 'd'),
(36, '3', 'e'),
(37, '&', 'e'),
(38, '€', 'e'),
(39, '£', 'e'),
(40, 'є', 'e'),
(42, '[-', 'e'),
(43, '|=-', 'e'),
(44, '|=', 'f'),
(45, 'ƒ', 'f'),
(46, '|#', 'f'),
(47, 'ph', 'f'),
(48, '/=', 'f'),
(49, '6', 'g'),
(50, '&', 'g'),
(51, '(_+', 'g'),
(52, '9', 'g'),
(53, 'C-', 'g'),
(54, 'gee', 'g'),
(55, '(γ,', 'g'),
(56, '#', 'h'),
(57, '/-/', 'h'),
(58, '[-]', 'h'),
(59, ']-[', 'h'),
(60, ')-(', 'h'),
(61, '(-)', 'h'),
(62, ' :-:', 'h'),
(63, '|~|', 'h'),
(64, '|-|', 'h'),
(65, ']~[', 'h'),
(66, '}{', 'h'),
(67, ']-[', 'h'),
(68, ' ?', 'h'),
(69, '}', 'h'),
(70, '-{', 'h'),
(71, 'hèch', 'h'),
(72, '1', 'i'),
(73, ' !', 'i'),
(74, '|', 'i'),
(75, '][', 'i'),
(76, 'eye', 'i'),
(77, '3y3', 'i'),
(78, ']', 'i'),
(79, ' : ', 'i'),
(80, '_|', 'j'),
(81, '_/', 'j'),
(82, '¿', 'j'),
(83, '</', 'j'),
(84, '(/', 'j'),
(85, 'ʝ', 'j'),
(86, 'X', 'k'),
(87, '|<', 'k'),
(88, '|{', 'k'),
(89, 'ɮ', 'k'),
(90, '<', 'k'),
(91, '|\\“', 'k'),
(92, '1', 'l'),
(93, '£', 'l'),
(94, '1_', 'l'),
(95, 'ℓ', 'l'),
(96, '|', 'l'),
(97, '|_', 'l'),
(98, '][_,', 'l'),
(99, '|v|', 'm'),
(100, '[V]', 'm'),
(101, '{V}', 'm'),
(102, '|\\/|', 'm'),
(103, '/\\/\\', 'm'),
(104, '(u)', 'm'),
(105, '(V)', 'm'),
(106, '(\\/)', 'm'),
(107, '/|\\', 'm'),
(108, '^^', 'm'),
(109, '/|/|', 'm'),
(110, '//.', 'm'),
(111, '.\\\\', 'm'),
(112, '/^^\\', 'm'),
(113, '///', 'm'),
(114, '|^^|', 'm'),
(115, '^/', 'n'),
(116, '|V', 'n'),
(117, '|\\|', 'n'),
(118, '/\\/', 'n'),
(119, '[\\]', 'n'),
(120, '<\\>', 'n'),
(121, '{\\}', 'n'),
(122, ']\\[', 'n'),
(123, '//', 'n'),
(124, '^', 'n'),
(125, '[]', 'n'),
(126, '/V', 'n'),
(127, '₪ ', 'n'),
(128, '0', 'o'),
(129, '()', 'o'),
(130, 'oh', 'o'),
(131, '[]', 'o'),
(132, '¤', 'o'),
(133, '°', 'o'),
(134, '([])', 'o'),
(135, '|*', 'p'),
(136, '|o', 'p'),
(137, '|º', 'p'),
(138, '|^(o)', 'p'),
(139, '|>', 'p'),
(140, '\"|\"\"\"', 'p'),
(141, '9', 'p'),
(142, '[]D', 'p'),
(143, '|̊', 'p'),
(144, '|7', 'p'),
(145, ' ?', 'p'),
(146, '/*', 'p'),
(147, '¶', 'p'),
(148, '/*', 'p'),
(149, '|D ', 'p'),
(150, '(_,)', 'q'),
(151, '()_', 'q'),
(152, '0_', 'q'),
(153, '°|', 'q'),
(154, '<|', 'q'),
(155, '0. ', 'q'),
(156, '2', 'r'),
(157, '|?', 'r'),
(158, '/2', 'r'),
(159, '|^', 'r'),
(160, 'lz', 'r'),
(161, '®', 'r'),
(162, '[z', 'r'),
(163, '12', 'r'),
(164, 'Я', 'r'),
(165, '|2', 'r'),
(166, 'ʁ', 'r'),
(167, '|²', 'r'),
(168, '.-', 'r'),
(169, ',-', 'r'),
(170, '|°\\', 'r'),
(171, 'Я ', 'r'),
(172, '5', 's'),
(173, '$', 's'),
(175, '§', 's'),
(176, 'ehs', 's'),
(178, '_/¯', 's'),
(179, '7', 't'),
(180, '+', 't'),
(181, '-|-', 't'),
(182, '1', 't'),
(183, '\'][\'', 't'),
(184, '†', 't'),
(185, '|²', 't'),
(186, '¯|¯', 't'),
(187, '(_)', 'u'),
(188, '|_|', 'u'),
(190, 'L|', 'u'),
(191, 'µ', 'u'),
(193, '\\/', 'v'),
(194, '1/', 'v'),
(195, '|/', 'v'),
(196, 'o|o', 'v'),
(197, '\\/\\/', 'w'),
(198, 'vv', 'w'),
(199, '\'//', 'w'),
(200, '\\\\`', 'w'),
(201, '\\^/', 'w'),
(202, '(n)', 'w'),
(203, '\\V/', 'w'),
(204, '\\X/', 'w'),
(205, '\\|/', 'w'),
(206, '\\_|_/', 'w'),
(207, '\\_:_/', 'w'),
(208, 'Ш', 'w'),
(209, 'ɰ', 'w'),
(210, '`^/', 'w'),
(211, '\\./', 'w'),
(212, '><', 'x'),
(213, 'Ж', 'x'),
(214, '}{', 'x'),
(215, 'ecks', 'x'),
(216, '×', 'x'),
(217, ')(', 'x'),
(218, '8', 'x'),
(219, '7', 'y'),
(221, '`/', 'y'),
(222, 'Ψ', 'y'),
(223, 'φ', 'y'),
(224, 'λ', 'y'),
(225, 'Ч', 'y'),
(226, '¥', 'y'),
(227, '\'/', 'y'),
(228, '≥', 'z'),
(229, '2', 'z'),
(230, '=/=', 'z'),
(231, '7_', 'z'),
(232, '~/_', 'z'),
(233, ' %', 'z'),
(234, '>_', 'z'),
(235, '>_', 'z'),
(236, '-\\_', 'z'),
(237, '\'/_', 'z');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
