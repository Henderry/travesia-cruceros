CREATE DATABASE  IF NOT EXISTS `prueba1` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `prueba1`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: prueba1
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `barco`
--

DROP TABLE IF EXISTS `barco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barco` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Descripcion` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Capacidad` int(11) DEFAULT NULL,
  `HabitacionesDispoinbles` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barco`
--

LOCK TABLES `barco` WRITE;
/*!40000 ALTER TABLE `barco` DISABLE KEYS */;
/*!40000 ALTER TABLE `barco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barco_habitacion`
--

DROP TABLE IF EXISTS `barco_habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barco_habitacion` (
  `IdBarco` int(11) NOT NULL,
  `IdHabitacion` int(11) NOT NULL,
  PRIMARY KEY (`IdBarco`,`IdHabitacion`),
  KEY `BarcoHabitacion_Habitacion_idx` (`IdHabitacion`),
  CONSTRAINT `BarcoHabitacion_Barco` FOREIGN KEY (`IdBarco`) REFERENCES `barco` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `BarcoHabitacion_Habitacion` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barco_habitacion`
--

LOCK TABLES `barco_habitacion` WRITE;
/*!40000 ALTER TABLE `barco_habitacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `barco_habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complemento`
--

DROP TABLE IF EXISTS `complemento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complemento` (
  `Id` int(11) NOT NULL,
  `Precio` float DEFAULT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  `PrecioAplicado` float DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complemento`
--

LOCK TABLES `complemento` WRITE;
/*!40000 ALTER TABLE `complemento` DISABLE KEYS */;
/*!40000 ALTER TABLE `complemento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crucero`
--

DROP TABLE IF EXISTS `crucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crucero` (
  `Id` int(11) NOT NULL,
  `IdBarco` int(11) DEFAULT NULL,
  `PuertaSalida` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Foto` blob DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Curcero_barco_idx` (`IdBarco`),
  CONSTRAINT `Curcero_barco` FOREIGN KEY (`IdBarco`) REFERENCES `barco` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crucero`
--

LOCK TABLES `crucero` WRITE;
/*!40000 ALTER TABLE `crucero` DISABLE KEYS */;
/*!40000 ALTER TABLE `crucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destino`
--

DROP TABLE IF EXISTS `destino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destino` (
  `Id` int(11) NOT NULL,
  `Pais` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Region` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='el lugar donde se va a ir';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destino`
--

LOCK TABLES `destino` WRITE;
/*!40000 ALTER TABLE `destino` DISABLE KEYS */;
/*!40000 ALTER TABLE `destino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fechascrucero`
--

DROP TABLE IF EXISTS `fechascrucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechascrucero` (
  `Id` int(11) NOT NULL,
  `IdCrucero` int(11) DEFAULT NULL,
  `FechaSalida` date DEFAULT NULL,
  `FechaVuelta` date DEFAULT NULL,
  `FechaLimitePago` date DEFAULT NULL,
  `CantDias` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Crucero_Fechas_idx` (`IdCrucero`),
  CONSTRAINT `Crucero_Fechas` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fechascrucero`
--

LOCK TABLES `fechascrucero` WRITE;
/*!40000 ALTER TABLE `fechascrucero` DISABLE KEYS */;
/*!40000 ALTER TABLE `fechascrucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `Id` int(11) NOT NULL,
  `Descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MinHusoedes` int(11) DEFAULT NULL,
  `Tamano` float DEFAULT NULL,
  `Tipo` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  `Disponibilidad` tinyint(4) DEFAULT NULL,
  `MaxHuespedes` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Habitaciones y sus tipos en los barcos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huesped`
--

DROP TABLE IF EXISTS `huesped`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `huesped` (
  `Id` int(11) NOT NULL,
  `IdReserva` int(11) DEFAULT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  `Sexo` varchar(45) DEFAULT NULL,
  `Edad` int(11) DEFAULT NULL,
  `Telefono` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Reserva_Huespedes_idx` (`IdReserva`),
  CONSTRAINT `Reserva_Huespedes` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `huesped`
--

LOCK TABLES `huesped` WRITE;
/*!40000 ALTER TABLE `huesped` DISABLE KEYS */;
/*!40000 ALTER TABLE `huesped` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `infopago`
--

DROP TABLE IF EXISTS `infopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `infopago` (
  `Id` int(11) NOT NULL,
  `IdReserva` int(11) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `InfoPago_Reserva_idx` (`IdReserva`),
  CONSTRAINT `InfoPago_Reserva` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infopago`
--

LOCK TABLES `infopago` WRITE;
/*!40000 ALTER TABLE `infopago` DISABLE KEYS */;
/*!40000 ALTER TABLE `infopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itinerario`
--

DROP TABLE IF EXISTS `itinerario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerario` (
  `IdPuerto` int(11) NOT NULL,
  `IdCrucero` int(11) NOT NULL,
  `CantDías` int(11) DEFAULT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`IdPuerto`,`IdCrucero`),
  KEY `Itinerario_Crucero` (`IdCrucero`),
  CONSTRAINT `Itinerario_Crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Itinerario_Puerto` FOREIGN KEY (`IdPuerto`) REFERENCES `puerto` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerario`
--

LOCK TABLES `itinerario` WRITE;
/*!40000 ALTER TABLE `itinerario` DISABLE KEYS */;
/*!40000 ALTER TABLE `itinerario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puerto`
--

DROP TABLE IF EXISTS `puerto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puerto` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IdDestino` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Destino_Puerto_idx` (`IdDestino`),
  CONSTRAINT `DestinoPuerto` FOREIGN KEY (`IdDestino`) REFERENCES `destino` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puerto`
--

LOCK TABLES `puerto` WRITE;
/*!40000 ALTER TABLE `puerto` DISABLE KEYS */;
/*!40000 ALTER TABLE `puerto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `Id` int(11) NOT NULL,
  `IdUsuario` int(11) DEFAULT NULL,
  `IdCrucero` int(11) DEFAULT NULL,
  `PrecioFinal` float DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Reserva_Crucero_idx` (`IdCrucero`),
  KEY `Reserva_Usuario_idx` (`IdUsuario`),
  CONSTRAINT `Reserva_Crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Reserva_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_complemento`
--

DROP TABLE IF EXISTS `reserva_complemento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_complemento` (
  `IdReserva` int(11) NOT NULL,
  `IdComplemento` int(11) NOT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdReserva`,`IdComplemento`),
  KEY `ReservaComplemento_Complemento_idx` (`IdComplemento`),
  CONSTRAINT `ReservaComplemento_Complemento` FOREIGN KEY (`IdComplemento`) REFERENCES `complemento` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ReservaComplemento_Reserva` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_complemento`
--

LOCK TABLES `reserva_complemento` WRITE;
/*!40000 ALTER TABLE `reserva_complemento` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva_complemento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservahabitacion`
--

DROP TABLE IF EXISTS `reservahabitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservahabitacion` (
  `idReserva` int(11) NOT NULL,
  `IdHabitacion` int(11) NOT NULL,
  `CantPasajeros` int(11) DEFAULT NULL,
  `ReservaHabitacioncol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idReserva`,`IdHabitacion`),
  KEY `ReservaHabitacion_Habitacion_idx` (`IdHabitacion`),
  CONSTRAINT `ReservaHabitacion_Habitacion` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ReservaHabitacion_Reserva` FOREIGN KEY (`idReserva`) REFERENCES `reserva` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservahabitacion`
--

LOCK TABLES `reservahabitacion` WRITE;
/*!40000 ALTER TABLE `reservahabitacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservahabitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolususario`
--

DROP TABLE IF EXISTS `rolususario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolususario` (
  `Id` int(11) NOT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolususario`
--

LOCK TABLES `rolususario` WRITE;
/*!40000 ALTER TABLE `rolususario` DISABLE KEYS */;
/*!40000 ALTER TABLE `rolususario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarjeta`
--

DROP TABLE IF EXISTS `tarjeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarjeta` (
  `Numero` int(20) NOT NULL,
  `CodigoSeguridad` int(11) DEFAULT NULL,
  `FechaVencimiento` date DEFAULT NULL,
  PRIMARY KEY (`Numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarjeta`
--

LOCK TABLES `tarjeta` WRITE;
/*!40000 ALTER TABLE `tarjeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarjeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `IdRol` int(11) DEFAULT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  `Correo` varchar(45) DEFAULT NULL,
  `Contrasena` varchar(45) DEFAULT NULL,
  `idTarjeta` int(20) DEFAULT NULL,
  `Telefono` int(10) DEFAULT NULL,
  `Pais` varchar(45) DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Usuario_Rol_idx` (`IdRol`),
  KEY `Usuario_Tarjeta_idx` (`idTarjeta`),
  CONSTRAINT `Usuario_Rol` FOREIGN KEY (`IdRol`) REFERENCES `rolususario` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Usuario_Tarjeta` FOREIGN KEY (`idTarjeta`) REFERENCES `tarjeta` (`Numero`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-09 15:08:14
