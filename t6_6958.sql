-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2023 at 11:40 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t6_6958`
--
CREATE DATABASE IF NOT EXISTS `t6_6958` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t6_6958`;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id_class` varchar(4) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_teacher` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id_class`, `name`, `id_teacher`) VALUES
('C001', 'Mind Reading', 'T001'),
('C002', 'Inner Peace', 'T002');

-- --------------------------------------------------------

--
-- Table structure for table `class_enrollments`
--

DROP TABLE IF EXISTS `class_enrollments`;
CREATE TABLE `class_enrollments` (
  `id_enroll` int(11) NOT NULL,
  `id_class` varchar(4) NOT NULL,
  `id_student` varchar(4) NOT NULL,
  `harian` int(3) DEFAULT NULL,
  `uts` int(3) DEFAULT NULL,
  `uas` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class_enrollments`
--

INSERT INTO `class_enrollments` (`id_enroll`, `id_class`, `id_student`, `harian`, `uts`, `uas`) VALUES
(1, 'C001', 'S001', 80, 90, 85),
(2, 'C001', 'S002', 70, 80, 75);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id_review` int(11) NOT NULL,
  `id_class` varchar(4) NOT NULL,
  `id_student` varchar(4) NOT NULL,
  `rating` int(1) NOT NULL,
  `review` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id_review`, `id_class`, `id_student`, `rating`, `review`) VALUES
(4, 'C001', 'S001', 5, 'Sangat Menyenangkan');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_user` varchar(4) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `password`, `role`) VALUES
('A001', 'Admin', 'admin123', '2'),
('S001', 'Kusanali', 'nahida', '0'),
('S002', 'Shenhe', 'shinkaku', '0'),
('T001', 'Rukkhadevata', 'lesserkusanali', '1'),
('T002', 'Cloud Retainer', 'adeptus', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id_class`);

--
-- Indexes for table `class_enrollments`
--
ALTER TABLE `class_enrollments`
  ADD PRIMARY KEY (`id_enroll`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id_review`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class_enrollments`
--
ALTER TABLE `class_enrollments`
  MODIFY `id_enroll` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
