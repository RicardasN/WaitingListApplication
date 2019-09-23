-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2019 m. Rgs 23 d. 23:21
-- Server version: 8.0.13-4
-- PHP Version: 7.2.19-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ZJtw5JjMUn`
--

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `specialist_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `wasServed` tinyint(1) NOT NULL DEFAULT '0',
  `ticketCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ticketClosed` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Sukurta duomenų kopija lentelei `clients`
--

INSERT INTO `clients` (`client_id`, `specialist_id`, `name`, `wasServed`, `token`) VALUES
(26, 14, ' Alice Green ', 1, '966659f9e92f88f6885ec366da199df2a05136dc'),
(27, 14, ' Monica Main ', 1, '7cdb61293e02d6e064ab7653a49beb6f06b5605c'),
(28, 14, ' Victoria Hethaway ', 1, '451c9f83130ab1befc7e77af72b6034696ac2c5a'),
(29, 14, ' Andrew Bold ', 1, 'b35c5bb29972b6a23b56c034615440b8ec03f675'),
(30, 14, ' Paul Shorne ', 1, 'b12a676c58b4ffa9b523fafe962d9c6239e20a6d'),
(31, 14, ' Anthony Neuer ', 1, 'd714e6fb571583dcbcfa30eca228a44769c47f62'),
(32, 16, ' Brad Bradbury ', 1, '57e74de9fc5779fa474bf1cd4e9653963a89e242'),
(33, 15, ' Johnathan Green ', 1, '0ae8475c4ce6a22fe64e28f4cab6ca9bf4ce3aa9'),
(34, 16, ' Edith Zanussi ', 1, 'bfdef636b53b4762c141c5da1d499fb303805f86'),
(35, 15, ' Julia Dandy ', 0, 'b3552da2d92025f852de5bd6c190d82e9687136a'),
(38, 14, ' Johnathan Green ', 0, '5ad53ceb85347e2ddd4987acae9889dd59dd2ed3'),
(39, 16, ' Victoria Naomi ', 0, 'c4f5ed98cf3bbb3bed9cfdf8c7a2276ea305c9c6'),
(40, 15, ' Anthony Freeman ', 0, '11dbff72f852e61fff92cc32cdf36f25ca4e8ca4'),
(41, 16, ' Melany Normandy ', 0, '73ea9b67f5d8115207de4954c504ea0e41a50c83'),
(42, 14, ' Ray Donavan ', 0, 'd3d1481a41c8f568f97fb8d3d401fff194643fe7'),
(43, 14, ' Logan Night ', 0, '40138a786c94981ab0337d9516afac1435b523a2');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `specialists`
--

CREATE TABLE `specialists` (
  `specialist_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `specialization_id` int(11) DEFAULT NULL,
  `averageServingTime` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Sukurta duomenų kopija lentelei `specialists`
--

INSERT INTO `specialists` (`specialist_id`, `name`, `username`, `password`, `specialization_id`, `averageServingTime`) VALUES
(14, 'Mike Mayers', 'mike.mayers', '$2a$10$uG.D6twYa0MRcOscVlCOTu5Z7Swsf026tBv7Oav/KZiK0oYiupjs6', 3, 7),
(15, 'John Mauer', 'john.mauer', '$2a$10$U8e49bZTbHeqHGH.xpsFBup0r4/aqxtOzGgkZHbr02OxT8nKWxPze', 2, 10),
(16, 'Judith Knight', 'judith.knight', '$2a$10$KeGrKXdoZPrwTEvReIsMludrJylCQbovkS7jE5d7ZjoKyP1bvVwDa', 1, 3);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `specializations`
--

CREATE TABLE `specializations` (
  `specialization_id` int(11) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Sukurta duomenų kopija lentelei `specializations`
--

INSERT INTO `specializations` (`specialization_id`, `specialization`) VALUES
(1, 'Insurance Consultant'),
(2, 'Investment consultant\r\n'),
(3, 'Personal banker');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `specialists`
--
ALTER TABLE `specialists`
  ADD PRIMARY KEY (`specialist_id`),
  ADD KEY `specialization_id` (`specialization_id`);

--
-- Indexes for table `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`specialization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `specialists`
--
ALTER TABLE `specialists`
  MODIFY `specialist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `specializations`
--
ALTER TABLE `specializations`
  MODIFY `specialization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Apribojimai eksportuotom lentelėm
--

--
-- Apribojimai lentelei `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`specialist_id`) ON DELETE CASCADE;

--
-- Apribojimai lentelei `specialists`
--
ALTER TABLE `specialists`
  ADD CONSTRAINT `specialists_ibfk_1` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`specialization_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
