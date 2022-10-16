CREATE TABLE `alias_commands` (
  `alias` varchar(30) NOT NULL,
  `command` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `alias_nation` (
  `alias` varchar(30) NOT NULL,
  `nation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `alias_tanks` (
  `alias` varchar(30) NOT NULL,
  `tank` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `audio` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `trigger_word` varchar(20) NOT NULL,
  `file` text NOT NULL,
  `volume` float NOT NULL DEFAULT 1,
  `timeout` int(11) NOT NULL,
  `frequency` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `commands` (
  `id` int(11) NOT NULL,
  `command` text NOT NULL,
  `value` text NOT NULL,
  `auto` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `config` (
  `id` varchar(30) NOT NULL,
  `value` text NOT NULL,
  `hidden` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `moderator` (
  `id` int(11) NOT NULL,
  `trigger_word` text NOT NULL,
  `mod_action` text NOT NULL,
  `explanation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `trigger_word` varchar(30) NOT NULL,
  `reaction` text NOT NULL,
  `frequency` int(11) NOT NULL,
  `timeout` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `shout` (
  `id` int(11) NOT NULL,
  `original` varchar(20) NOT NULL,
  `replacement` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `alias_commands`
  ADD PRIMARY KEY (`alias`);

ALTER TABLE `alias_nation`
  ADD PRIMARY KEY (`alias`);

ALTER TABLE `alias_tanks`
  ADD PRIMARY KEY (`alias`);

ALTER TABLE `audio`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `commands`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `moderator`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `shout`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tanks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

ALTER TABLE `audio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `commands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `moderator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `shout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tanks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;