-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2019 at 06:35 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waitingapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `specialist_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `wasServed` tinyint(1) NOT NULL DEFAULT 0,
  `ticketCreated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `specialist_id`, `name`, `wasServed`, `ticketCreated`) VALUES
(3, 2, 'Victoria', 0, '2019-09-18 17:18:04'),
(4, 1, 'John', 0, '2019-09-18 17:18:04'),
(5, 3, 'Judy', 0, '2019-09-18 18:35:02'),
(6, 1, 'John', 0, '2019-09-18 18:39:26'),
(7, 1, ' Viktorija ', 0, '2019-09-18 18:48:51'),
(8, 1, ' Monika ', 0, '2019-09-18 18:50:19'),
(9, 1, ' Jim Johnson ', 1, '2019-09-18 19:04:06');

-- --------------------------------------------------------

--
-- Table structure for table `specialists`
--

CREATE TABLE `specialists` (
  `specialist_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `specialization_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialists`
--

INSERT INTO `specialists` (`specialist_id`, `name`, `username`, `password`, `specialization_id`) VALUES
(1, 'John Bauer', '', '', 1),
(2, 'Alice Green', '', '', 2),
(3, 'Judy Wraith', '', '', 3),
(8, 'Viktorija', 'Influencer', '$2a$10$4VaEIW10HksZ22y3W2bd7OS3.ntHPsTnqUuUhcOd5ZchwTed0oxZO', 1),
(9, 'Viktorija', 'Influencer22', '$2a$10$QpjKEZPBrOvPRtve0S8//O0OI2piIMwqFL4ivPlykQoysvzkAih5S', 1);

-- --------------------------------------------------------

--
-- Table structure for table `specializations`
--

CREATE TABLE `specializations` (
  `specialization_id` int(11) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specializations`
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
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `specialists`
--
ALTER TABLE `specialists`
  MODIFY `specialist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `specializations`
--
ALTER TABLE `specializations`
  MODIFY `specialization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`specialist_id`) ON DELETE CASCADE;

--
-- Constraints for table `specialists`
--
ALTER TABLE `specialists`
  ADD CONSTRAINT `specialists_ibfk_1` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`specialization_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
