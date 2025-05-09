CREATE DATABASE  IF NOT EXISTS `splitter` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `splitter`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: splitter
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `account_id` int NOT NULL,
  `contact_id` int NOT NULL,
  PRIMARY KEY (`account_id`,`contact_id`),
  KEY `contact_id` (`contact_id`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `useraccount` (`account_id`),
  CONSTRAINT `contact_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `useraccount` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (4,1),(5,1),(10,1),(1,2),(11,2),(1,3),(2,4),(2,5),(3,6),(5,6),(6,7),(7,8),(8,9),(9,10);
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense` (
  `expense_id` int NOT NULL AUTO_INCREMENT,
  `expense_amount` float NOT NULL,
  `expense_date_time` datetime NOT NULL,
  `expense_title` varchar(255) NOT NULL,
  `account_id` int NOT NULL,
  PRIMARY KEY (`expense_id`),
  UNIQUE KEY `expense_id` (`expense_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `useraccount` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense`
--

LOCK TABLES `expense` WRITE;
/*!40000 ALTER TABLE `expense` DISABLE KEYS */;
INSERT INTO `expense` VALUES (1,23.5,'2025-04-01 14:00:00','Coffee with team',1),(2,100,'2025-04-02 13:20:00','Groceries',1),(3,250,'2025-04-03 18:00:00','Concert tickets',1),(4,15.75,'2025-04-04 09:15:00','Taxi ride',1),(5,60,'2025-04-05 11:30:00','Lunch at cafe',1),(6,45,'2025-04-01 12:00:00','Snacks',2),(7,95,'2025-04-02 19:00:00','Restaurant dinner',2),(8,180,'2025-04-03 10:00:00','Furniture',2),(9,29.99,'2025-04-04 16:45:00','Gas',2),(10,10.5,'2025-04-05 08:00:00','Parking',2),(11,33,'2025-04-01 13:00:00','Groceries',3),(12,110,'2025-04-02 15:30:00','Tech gadget',3),(13,20,'2025-04-03 17:30:00','Pizza night',3),(14,75,'2025-04-04 20:00:00','Bar tab',3),(15,5,'2025-04-05 09:10:00','Coffee',3),(16,99.99,'2025-04-01 17:00:00','Shoes',4),(17,49.5,'2025-04-02 14:20:00','Books',4),(18,120,'2025-04-03 11:00:00','Gym Membership',4),(19,18,'2025-04-04 19:30:00','Movie',4),(20,80,'2025-04-05 10:30:00','Brunch',4),(21,12,'2025-04-01 10:00:00','Subway ticket',5),(22,200,'2025-04-02 21:00:00','Appliance',5),(23,30,'2025-04-03 09:00:00','Breakfast',5),(24,88.88,'2025-04-04 16:00:00','Shoes',5),(25,47,'2025-04-05 12:00:00','Cosmetics',5),(26,55,'2025-04-01 15:30:00','Lunch',6),(27,77.7,'2025-04-02 10:00:00','Taxi',6),(28,180,'2025-04-03 14:00:00','Desk',6),(29,33,'2025-04-04 13:00:00','Snacks',6),(30,22.22,'2025-04-05 18:00:00','Soda',6),(31,65,'2025-04-01 08:30:00','Gym',7),(32,40,'2025-04-02 19:30:00','Drinks',7),(33,90,'2025-04-03 22:00:00','Dinner party',7),(34,12.5,'2025-04-04 12:00:00','Coffee',7),(35,30,'2025-04-05 16:30:00','Lunch',7),(36,100,'2025-04-01 09:00:00','Books',8),(37,200,'2025-04-02 20:00:00','Microwave',8),(38,45,'2025-04-03 11:30:00','Bus pass',8),(39,10,'2025-04-04 08:00:00','Breakfast',8),(40,88,'2025-04-05 13:00:00','Bicycle repair',8),(41,150,'2025-04-01 07:45:00','Groceries',9),(42,60,'2025-04-02 12:00:00','Coffee beans',9),(43,20,'2025-04-03 18:45:00','Music subscription',9),(44,34,'2025-04-04 17:15:00','Pet food',9),(45,15,'2025-04-05 19:00:00','Snacks',9),(46,8.99,'2025-04-01 14:45:00','Energy drink',10),(47,70,'2025-04-02 17:30:00','Shoes',10),(48,29,'2025-04-03 15:00:00','Taxi',10),(49,99,'2025-04-04 20:00:00','Event ticket',10),(50,55.55,'2025-04-05 22:00:00','Pizza night',10),(51,245,'2025-05-04 00:00:00','Test',1),(52,245,'2025-05-04 00:00:00','Test',1),(53,245,'2025-05-04 00:00:00','Test',1),(54,350,'2025-05-04 11:59:16','Testback',2),(55,234,'2025-05-04 12:46:16','Test Two',2),(56,2345,'2025-05-04 12:51:21','Test three',2),(57,321,'2025-05-04 12:54:41','Tesyrsf',1),(58,345,'2025-05-05 01:10:56','Test four',2),(59,123.32,'2025-05-07 08:29:34','Grocery',1),(60,600,'2025-05-07 08:30:27','Rent',2),(61,395.99,'2025-05-07 08:32:11','Child Support',11),(62,95.87,'2025-05-07 08:36:06','Dinner :)',1),(63,45.32,'2025-05-07 08:37:26','Breakfast',2),(64,76.87,'2025-05-07 08:51:57','Theater Snacks',1),(65,500,'2025-05-07 08:53:05','Rent !!!',2);
/*!40000 ALTER TABLE `expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `splithistory`
--

DROP TABLE IF EXISTS `splithistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `splithistory` (
  `split_id` int NOT NULL AUTO_INCREMENT,
  `split_date_time` datetime NOT NULL,
  `approval_status` tinyint(1) DEFAULT NULL,
  `expense_id` int NOT NULL,
  PRIMARY KEY (`split_id`),
  UNIQUE KEY `split_id` (`split_id`),
  KEY `expense_id` (`expense_id`),
  CONSTRAINT `splithistory_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `expense` (`expense_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `splithistory`
--

LOCK TABLES `splithistory` WRITE;
/*!40000 ALTER TABLE `splithistory` DISABLE KEYS */;
INSERT INTO `splithistory` VALUES (1,'2025-04-02 13:20:00',1,2),(2,'2025-04-03 18:00:00',NULL,3),(3,'2025-04-02 19:00:00',0,7),(4,'2025-04-04 20:00:00',1,13),(5,'2025-04-05 10:30:00',NULL,20),(6,'2025-04-03 14:00:00',1,28),(7,'2025-04-03 22:00:00',0,33),(8,'2025-04-04 17:15:00',NULL,44),(9,'2025-04-04 20:00:00',1,49),(10,'2025-05-04 00:00:00',NULL,51),(11,'2025-05-04 00:00:00',NULL,52),(12,'2025-05-04 00:00:00',NULL,53),(13,'2025-05-04 11:59:16',NULL,54),(14,'2025-05-04 12:46:16',NULL,55),(15,'2025-05-04 12:51:21',NULL,56),(16,'2025-05-04 12:54:41',NULL,57),(17,'2025-05-05 01:10:56',NULL,58),(18,'2025-05-07 08:29:34',NULL,59),(19,'2025-05-07 08:30:27',NULL,60),(20,'2025-05-07 08:32:11',NULL,61),(21,'2025-05-07 08:36:06',NULL,62),(22,'2025-05-07 08:37:26',NULL,63),(23,'2025-05-07 08:51:57',NULL,64),(24,'2025-05-07 08:53:05',NULL,65);
/*!40000 ALTER TABLE `splithistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `splitmember`
--

DROP TABLE IF EXISTS `splitmember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `splitmember` (
  `split_amount` float NOT NULL,
  `member_approval_status` tinyint(1) DEFAULT NULL,
  `account_id` int NOT NULL,
  `split_id` int NOT NULL,
  PRIMARY KEY (`split_id`,`account_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `splitmember_ibfk_1` FOREIGN KEY (`split_id`) REFERENCES `splithistory` (`split_id`),
  CONSTRAINT `splitmember_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `useraccount` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `splitmember`
--

LOCK TABLES `splitmember` WRITE;
/*!40000 ALTER TABLE `splitmember` DISABLE KEYS */;
INSERT INTO `splitmember` VALUES (40,1,2,1),(60,1,3,1),(125,NULL,2,2),(125,NULL,4,2),(40,0,1,3),(55,0,5,3),(25,1,1,4),(25,1,6,4),(40,NULL,3,5),(40,NULL,5,5),(90,1,7,6),(90,1,8,6),(45,0,1,7),(45,0,2,7),(17,NULL,4,8),(17,NULL,7,8),(49.5,1,6,9),(49.5,1,9,9),(73.5,1,2,12),(262.5,1,1,13),(45.67,1,1,14),(938,0,1,15),(123,0,2,16),(241.5,0,1,17),(50,NULL,3,18),(300,NULL,1,19),(158.396,NULL,2,20),(76.696,0,2,21),(20,1,1,22),(61.496,0,2,23),(200,1,1,24);
/*!40000 ALTER TABLE `splitmember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraccount`
--

DROP TABLE IF EXISTS `useraccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useraccount` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `account_balance` float NOT NULL DEFAULT '0',
  `dark_mode` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraccount`
--

LOCK TABLES `useraccount` WRITE;
/*!40000 ALTER TABLE `useraccount` DISABLE KEYS */;
INSERT INTO `useraccount` VALUES (1,'Alice','Smith','alice123','alice@example.com',150.5,0),(2,'Bob','Johnson','bobpass','bob@example.com',200,0),(3,'Charlie','Brown','charlieb','charlie@example.com',75.25,1),(4,'Dana','White','danapass','dana@example.com',300.1,0),(5,'Eve','Davis','eve321','eve@example.com',120,1),(6,'Frank','Miller','frankie','frank@example.com',500,0),(7,'Grace','Lee','gracepwd','grace@example.com',80.75,1),(8,'Henry','Walker','henrypwd','henry@example.com',60.4,0),(9,'Isabel','Young','isa321','isabel@example.com',90,1),(10,'Jack','Hall','jackpass','jack@example.com',45.25,0),(11,'Boby','Bobmaster','bob123','bob@example.com',0,0);
/*!40000 ALTER TABLE `useraccount` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 18:44:46
