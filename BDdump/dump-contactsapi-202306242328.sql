-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: contactsapi
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.3-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `favorite` tinyint(1) NOT NULL DEFAULT 0,
  `owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contacts_FK` (`owner`),
  CONSTRAINT `contacts_FK` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (3,'Allen Raymond','nulla.ante@vestibul.co.uk','(992) 914-3792',0,30),(4,'Allen Raymond','test7778887@com.ua','(992) 914-3792',1,30),(5,'Allen Raymond','nulla.ante@vestibul.co.uk','(992) 914-3792',0,25),(9,'Allen Raymond001','test001@com.ua','(992) 914-3792001',0,30),(10,'Allen Raymond001','test001@com.ua','(992) 914-3792001',1,30),(11,'Allen Raymond001','test001@com.ua','(992) 914-3792001',1,30),(12,'Allen Raymond1','test001@com.ua','(992) 121212121',0,30);
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `password` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `subscription` enum('starter','pro','business') NOT NULL DEFAULT 'starter',
  `verify` tinyint(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(100) DEFAULT NULL,
  `avatarURL` varchar(200) DEFAULT NULL,
  `token` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_un` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'123','tesma@mail','starter',0,NULL,NULL,''),(25,'$2b$10$nGJyLlT1bpDm2i9MAA6r.O44UMknoXAM4mDcNBOGU0Lk.ViPoAfHu','pefewi8678@meidecn.com','starter',0,'87356372-9e9b-4dd7-b5b2-d5a0d0e91a60',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImlhdCI6MTY4Njc3NzAzOCwiZXhwIjoxNjg2ODYzNDM4fQ.nrFuAMTjYYdv_AvvAeukKsvBleMvIaeHjx8tPaNZM0Q'),(26,'$2b$10$wOWIRV/qBuH11S2Vcig/mO26A0.XC5XW7vjpcadoRmEpYNMTuy0Me','gerot51181@anomgo.com','starter',1,NULL,NULL,NULL),(27,'$2b$10$18c0kCLtVyg4juTotEN35OrytXflb9c3zrnxNgInPVBypaQ1HcRFu','xinin50590@anomgo.com','starter',1,'',NULL,NULL),(28,'$2b$10$HVRwVyzftxUsoluo/N7C/eaIpiKOrXIS1lYcz0IXAWqhTvNZWhrSC','vimige8661@akoption.com','pro',1,NULL,'avatars\\62b38bd2-ea7a-46ea-844a-80019e9e3336.jpg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsImlhdCI6MTY4Njk0NDEzMywiZXhwIjoxNjg3MDMwNTMzfQ.RbJrWTRE0yBxQipHI1y2UKuihnSbNZVZf-XRPlKtl4o'),(30,'$2b$10$RSKSzk5vMl7mTSroE/2NcOBohN.9oDHAh8EY69t1j/jmZCtF2XtEy','wiher78048@anwarb.com','pro',1,'1f9ce5ba-f706-4c0a-a18d-4b1193b233df','https://www.gravatar.com/avatar/ccea92b32b33b93fdff6b5d52d20160b.jpg?d=wavatar','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTY4NzQ2NTkzMywiZXhwIjoxNjg3NTUyMzMzfQ.4ggMDHJNlm9r3IkkBA_holeMI0b3mXUayo_09FC1hMY'),(31,'$2b$10$XcslFiG1vJC7nINlXbsfYeM1F/u07g5fK6fxBlELOBUshFdJ46gC6','sevope6030@aaorsi.com','starter',1,NULL,'avatars\\c132dd5d-c82c-4165-bebb-ab31129b5d21.jpg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY4NzM4MTg0MiwiZXhwIjoxNjg3NDY4MjQyfQ.DDsh-ixrXnsvDcYHn0CGdpZF9mksOvKpH4I5l0UsrUA'),(32,'$2b$10$Xr8BonguaJAK8s0xMFuQzOtzbSe2k66BE3sHCmKDQ48oAIKA9m8HO','ceser80397@in2reach.com','starter',0,'10e9eca1-676b-4114-9db8-1e23606750c9','https://www.gravatar.com/avatar/b4da374b913d5575f6d06a06ca166937.jpg?d=wavatar',NULL),(33,'$2b$10$Awq8Ud6o.7rbzs20nOfjT.g6O26rXwD1EWPabMUVEc17FcOqgBiyC','ceser80397@in2reach.co','starter',0,'54d10569-681f-49a9-9ba0-43c51d1ad625','https://www.gravatar.com/avatar/27890f8b8a456b05a7ba05de2441d1bf.jpg?d=wavatar',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'contactsapi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-24 23:28:03
