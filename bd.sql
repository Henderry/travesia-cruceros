CREATE DATABASE  IF NOT EXISTS `prueba1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
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
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Descripcion` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Capacidad` int(11) DEFAULT NULL,
  `HabitacionesDispoinbles` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barco`
--

LOCK TABLES `barco` WRITE;
/*!40000 ALTER TABLE `barco` DISABLE KEYS */;
INSERT INTO `barco` VALUES (1,'Pinto','Barco el pinto',70,32),(2,'Managlar','Barco el Manglar',100,30),(3,'La Virgen','barco la Virgen',150,35),(7,'Pantorrilla','pantorilla la prantorilla',100,28);
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
  `CantDisponible` int(11) DEFAULT NULL,
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
INSERT INTO `barco_habitacion` VALUES (1,1,10),(1,2,15),(1,3,7),(2,1,10),(2,2,15),(2,3,5),(3,1,15),(3,2,20),(7,2,8),(7,3,6),(7,4,14);
/*!40000 ALTER TABLE `barco_habitacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_habitaciones_disponibles
AFTER INSERT ON barco_habitacion
FOR EACH ROW
BEGIN
    UPDATE barco
    SET HabitacionesDispoinbles = (
        SELECT SUM(CantDisponible)
        FROM barco_habitacion
        WHERE IdBarco = NEW.IdBarco
    )
    WHERE Id = NEW.IdBarco;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_habitaciones_modificadas
AFTER UPDATE ON barco_habitacion
FOR EACH ROW
BEGIN
    -- Actualizar el barco original (por si cambió el IdBarco)
    UPDATE barco
    SET HabitacionesDisponibles = (
        SELECT SUM(CantDisponible)
        FROM barco_habitacion
        WHERE IdBarco = OLD.IdBarco
    )
    WHERE Id = OLD.IdBarco;

    -- Actualizar el nuevo barco (si el IdBarco fue modificado)
    IF NEW.IdBarco != OLD.IdBarco THEN
        UPDATE barco
        SET HabitacionesDisponibles = (
            SELECT SUM(CantDisponible)
            FROM barco_habitacion
            WHERE IdBarco = NEW.IdBarco
        )
        WHERE Id = NEW.IdBarco;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `complemento`
--

DROP TABLE IF EXISTS `complemento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complemento` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Precio` float DEFAULT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  `PrecioAplicado` float DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complemento`
--

LOCK TABLES `complemento` WRITE;
/*!40000 ALTER TABLE `complemento` DISABLE KEYS */;
INSERT INTO `complemento` VALUES (1,10,'Paño',2000),(2,10,'Limpieza',10000),(3,10,'Masaje',15000);
/*!40000 ALTER TABLE `complemento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crucero`
--

DROP TABLE IF EXISTS `crucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crucero` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdBarco` int(11) DEFAULT NULL,
  `Foto` varchar(100) DEFAULT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Curcero_barco_idx` (`IdBarco`),
  CONSTRAINT `Curcero_barco` FOREIGN KEY (`IdBarco`) REFERENCES `barco` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crucero`
--

LOCK TABLES `crucero` WRITE;
/*!40000 ALTER TABLE `crucero` DISABLE KEYS */;
INSERT INTO `crucero` VALUES (1,1,'puertoPanama.jpg','Elevo Resort'),(2,1,'puerto2.jpg','Fiesta Resort'),(3,3,'puerto3.jpg','Oceania Cruises'),(4,2,'puerto4.jpg','Crystal Cruises'),(7,2,'default.jpg','Prueba Crucero ');
/*!40000 ALTER TABLE `crucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destino`
--

DROP TABLE IF EXISTS `destino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destino` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Pais` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Region` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='el lugar donde se va a ir';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destino`
--

LOCK TABLES `destino` WRITE;
/*!40000 ALTER TABLE `destino` DISABLE KEYS */;
INSERT INTO `destino` VALUES (1,'Costa Rica','Limon'),(2,'Costa Rica','Guanacaste'),(3,'Colobia','Marte'),(4,'Panama','Puertoaja');
/*!40000 ALTER TABLE `destino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fechascrucero`
--

DROP TABLE IF EXISTS `fechascrucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechascrucero` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdCrucero` int(11) DEFAULT NULL,
  `FechaSalida` date DEFAULT NULL,
  `FechaLimitePago` date DEFAULT NULL,
  `CantDias` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Crucero_Fechas_idx` (`IdCrucero`),
  CONSTRAINT `Crucero_Fechas` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fechascrucero`
--

LOCK TABLES `fechascrucero` WRITE;
/*!40000 ALTER TABLE `fechascrucero` DISABLE KEYS */;
INSERT INTO `fechascrucero` VALUES (1,1,'2025-02-20','2025-02-10',10),(2,2,'2025-02-25','2025-02-10',5),(3,3,'2025-04-10','2025-03-30',10),(4,4,'2025-03-01','2025-02-23',7),(5,1,'2025-05-01','2025-04-20',10),(107,7,'2025-03-24','2025-03-12',11);
/*!40000 ALTER TABLE `fechascrucero` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER eliminar_precios_habitacion
BEFORE DELETE ON fechascrucero
FOR EACH ROW
BEGIN
    -- Eliminar registros relacionados en precio_habitacion_crucero
    DELETE FROM precio_habitacion_crucero
    WHERE IdFechasCrucero = OLD.Id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MinHusoedes` int(11) DEFAULT NULL,
  `Tamano` float DEFAULT NULL,
  `Tipo` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  `Disponibilidad` tinyint(4) DEFAULT NULL,
  `MaxHuespedes` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Habitaciones y sus tipos en los barcos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
INSERT INTO `habitacion` VALUES (1,'habitacion de tipo economico',1,10,'Economica',30000,1,5),(2,'habitacion de tipo premium',1,20,'Premium',50000,1,10),(3,'Habitacion de tipo estandar',1,15,'Estandar',40000,1,7),(4,'Habitacion solo para presindentes solo',1,19,'Precidencial',100,1,12);
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
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdReserva` int(11) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `InfoPago_Reserva_idx` (`IdReserva`),
  CONSTRAINT `InfoPago_Reserva` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infopago`
--

LOCK TABLES `infopago` WRITE;
/*!40000 ALTER TABLE `infopago` DISABLE KEYS */;
INSERT INTO `infopago` VALUES (1,3,'2025-02-01');
/*!40000 ALTER TABLE `infopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itinerario`
--

DROP TABLE IF EXISTS `itinerario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerario` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdPuerto` int(11) DEFAULT NULL,
  `IdCrucero` int(11) DEFAULT NULL,
  `Fecha` int(11) DEFAULT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Itinerario_puerto_idx` (`IdPuerto`),
  KEY `Itinerario_crucero_idx` (`IdCrucero`),
  CONSTRAINT `Itinerario_crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Itinerario_puerto` FOREIGN KEY (`IdPuerto`) REFERENCES `puerto` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerario`
--

LOCK TABLES `itinerario` WRITE;
/*!40000 ALTER TABLE `itinerario` DISABLE KEYS */;
INSERT INTO `itinerario` VALUES (1,1,1,1,'Llegada a puerto Limon'),(2,1,2,1,'Llegada a puerto limon'),(3,1,4,1,'Salida de puerto Puerto y llegada a puerto Limon'),(4,2,1,2,'Salida de puerto Limon y llegada a puerto Guanacaste'),(5,2,2,2,'Salida de puerto Limon y llegada a puerto Guanacaste'),(6,2,3,1,'Salida de puerto Marte y llegada a puerto Guanacaste'),(7,3,3,2,'Salida desde el puerto Marte'),(8,4,4,2,'Salida desde el puerto Puerto'),(140,4,7,1,'Desripcion de prueba 1'),(141,2,7,3,'Desripcion de prueba 3');
/*!40000 ALTER TABLE `itinerario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `precio_habitacion_crucero`
--

DROP TABLE IF EXISTS `precio_habitacion_crucero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `precio_habitacion_crucero` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdFechasCrucero` int(11) DEFAULT NULL,
  `IdHabitacion` int(11) DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `habitacion_precio_habitacion_crucero_idx` (`IdHabitacion`),
  KEY `fechascrucero_precio_habitacion_crucero_idx` (`IdFechasCrucero`),
  CONSTRAINT `fechascrucero_precio_habitacion_crucero` FOREIGN KEY (`IdFechasCrucero`) REFERENCES `fechascrucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `habitacion_precio_habitacion_crucero` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=318 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `precio_habitacion_crucero`
--

LOCK TABLES `precio_habitacion_crucero` WRITE;
/*!40000 ALTER TABLE `precio_habitacion_crucero` DISABLE KEYS */;
INSERT INTO `precio_habitacion_crucero` VALUES (1,1,1,30000),(2,1,2,50000),(3,1,3,40000),(4,2,1,35000),(5,2,2,55000),(6,2,3,45000),(7,3,1,15000),(8,3,2,30000),(9,3,3,20000),(10,4,1,30000),(11,4,2,50000),(12,4,3,39000),(13,5,1,31000),(14,5,2,51000),(15,5,3,41000),(315,107,3,10500),(316,107,2,30000),(317,107,1,20000);
/*!40000 ALTER TABLE `precio_habitacion_crucero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puerto`
--

DROP TABLE IF EXISTS `puerto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puerto` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IdDestino` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Destino_Puerto_idx` (`IdDestino`),
  CONSTRAINT `DestinoPuerto` FOREIGN KEY (`IdDestino`) REFERENCES `destino` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puerto`
--

LOCK TABLES `puerto` WRITE;
/*!40000 ALTER TABLE `puerto` DISABLE KEYS */;
INSERT INTO `puerto` VALUES (1,'Puerto limon ',1),(2,'Puerto Guanacaste',2),(3,'Puerto marte',3),(4,'puerto puerto',4);
/*!40000 ALTER TABLE `puerto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) DEFAULT NULL,
  `IdCrucero` int(11) DEFAULT NULL,
  `PrecioFinal` float DEFAULT NULL,
  `IdFechaCrucero` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Reserva_Crucero_idx` (`IdCrucero`),
  KEY `Reserva_Usuario_idx` (`IdUsuario`),
  KEY `Reserva_fechacrucero_idx` (`IdFechaCrucero`),
  CONSTRAINT `Reserva_Crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Reserva_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Reserva_fechacrucero` FOREIGN KEY (`IdFechaCrucero`) REFERENCES `fechascrucero` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,2,1,99000,1),(2,3,1,96000,5),(3,4,3,29000,3);
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
INSERT INTO `reserva_complemento` VALUES (1,1,2),(1,3,1),(2,1,2),(2,2,1),(3,1,2),(3,2,1);
/*!40000 ALTER TABLE `reserva_complemento` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_precio_complemento
AFTER INSERT ON reserva_complemento
FOR EACH ROW
BEGIN
    DECLARE precio_habitacion FLOAT;
    DECLARE precio_complemento FLOAT;
    DECLARE id_fechas_crucero INT;

    -- Obtener DIRECTAMENTE el IdFechaCrucero de la reserva
    SELECT r.IdFechaCrucero 
    INTO id_fechas_crucero
    FROM reserva r
    WHERE r.Id = NEW.IdReserva;

    -- Calcular precio de habitaciones (usando tu query que funciona)
    SELECT COALESCE(SUM(phc.Precio), 0)
    INTO precio_habitacion
    FROM reservahabitacion rh
    JOIN precio_habitacion_crucero phc 
        ON rh.IdHabitacion = phc.IdHabitacion
        AND phc.IdFechasCrucero = id_fechas_crucero
    WHERE rh.IdReserva = NEW.IdReserva;

    -- Calcular precio complementos (sin cambios)
    SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
    INTO precio_complemento
    FROM reserva_complemento rc
    JOIN complemento c ON rc.IdComplemento = c.Id
    WHERE rc.IdReserva = NEW.IdReserva;

    -- Actualizar con IVA si es necesario
    UPDATE reserva r
    SET r.PrecioFinal = precio_habitacion + precio_complemento
    WHERE r.Id = NEW.IdReserva;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_precio_complemento_update
AFTER UPDATE ON reserva_complemento
FOR EACH ROW
BEGIN
    DECLARE precio_habitacion FLOAT;
    DECLARE precio_complemento FLOAT;
    DECLARE id_fechas_crucero INT;

    -- Obtener el IdFechaCrucero de la reserva afectada
    SELECT r.IdFechaCrucero 
    INTO id_fechas_crucero
    FROM reserva r
    WHERE r.Id = NEW.IdReserva;

    -- Calcular precio de habitaciones (usando la fecha correcta)
    SELECT COALESCE(SUM(phc.Precio), 0)
    INTO precio_habitacion
    FROM reservahabitacion rh
    JOIN precio_habitacion_crucero phc 
        ON rh.IdHabitacion = phc.IdHabitacion
        AND phc.IdFechasCrucero = id_fechas_crucero
    WHERE rh.IdReserva = NEW.IdReserva;

    -- Calcular nuevo precio de complementos (incluyendo el cambio)
    SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
    INTO precio_complemento
    FROM reserva_complemento rc
    JOIN complemento c ON rc.IdComplemento = c.Id
    WHERE rc.IdReserva = NEW.IdReserva;

    -- Actualizar el precio final considerando posibles cambios
    UPDATE reserva r
    SET r.PrecioFinal = precio_habitacion + precio_complemento
    WHERE r.Id = NEW.IdReserva;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
INSERT INTO `reservahabitacion` VALUES (1,1,2),(1,2,3),(2,1,7),(2,2,6),(3,1,5);
/*!40000 ALTER TABLE `reservahabitacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_precio_habitacion
AFTER INSERT ON reservahabitacion
FOR EACH ROW
BEGIN
    DECLARE precio_habitacion FLOAT;
    DECLARE precio_complemento FLOAT;
    DECLARE id_fechas_crucero INT;

    -- Obtener directamente el IdFechaCrucero de la reserva
    SELECT r.IdFechaCrucero 
    INTO id_fechas_crucero
    FROM reserva r
    WHERE r.Id = NEW.idReserva;

    -- Calcular precio de habitaciones (usando IdFechaCrucero directo)
    SELECT COALESCE(SUM(phc.Precio), 0)
    INTO precio_habitacion
    FROM reservahabitacion rh
    JOIN precio_habitacion_crucero phc 
        ON rh.IdHabitacion = phc.IdHabitacion
        AND phc.IdFechasCrucero = id_fechas_crucero
    WHERE rh.IdReserva = NEW.idReserva;

    -- Calcular precio de complementos existentes
    SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
    INTO precio_complemento
    FROM reserva_complemento rc
    JOIN complemento c ON rc.IdComplemento = c.Id
    WHERE rc.IdReserva = NEW.idReserva;

    -- Actualizar precio final con ambos componentes
    UPDATE reserva r
    SET r.PrecioFinal = precio_habitacion + precio_complemento
    WHERE r.Id = NEW.idReserva;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER actualizar_precio_habitacion_update
AFTER UPDATE ON reservahabitacion
FOR EACH ROW
BEGIN
    DECLARE precio_habitacion FLOAT;
    DECLARE precio_complemento FLOAT;
    DECLARE id_fechas_crucero INT;

    -- Obtener el IdFechaCrucero de la reserva afectada
    SELECT r.IdFechaCrucero 
    INTO id_fechas_crucero
    FROM reserva r
    WHERE r.Id = NEW.IdReserva;

    -- Calcular precio de habitaciones (incluyendo el cambio)
    SELECT COALESCE(SUM(phc.Precio), 0)
    INTO precio_habitacion
    FROM reservahabitacion rh
    JOIN precio_habitacion_crucero phc 
        ON rh.IdHabitacion = phc.IdHabitacion
        AND phc.IdFechasCrucero = id_fechas_crucero
    WHERE rh.IdReserva = NEW.IdReserva;

    -- Calcular precio de complementos existentes
    SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
    INTO precio_complemento
    FROM reserva_complemento rc
    JOIN complemento c ON rc.IdComplemento = c.Id
    WHERE rc.IdReserva = NEW.IdReserva;

    -- Actualizar el precio final considerando cambios
    UPDATE reserva r
    SET r.PrecioFinal = precio_habitacion + precio_complemento
    WHERE r.Id = NEW.IdReserva;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `rolususario`
--

DROP TABLE IF EXISTS `rolususario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolususario` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolususario`
--

LOCK TABLES `rolususario` WRITE;
/*!40000 ALTER TABLE `rolususario` DISABLE KEYS */;
INSERT INTO `rolususario` VALUES (1,'Cliente'),(2,'Administrador');
/*!40000 ALTER TABLE `rolususario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarjeta`
--

DROP TABLE IF EXISTS `tarjeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarjeta` (
  `Numero` varchar(40) NOT NULL,
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
INSERT INTO `tarjeta` VALUES ('2223003122003222',724,'2030-08-01'),('5105105105105100',415,'2029-03-01'),('5200828282828210',457,'2027-12-01');
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
  `idTarjeta` varchar(40) DEFAULT NULL,
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
INSERT INTO `usuario` VALUES (1,2,'Administrador','admin@gmail.com','123456',NULL,72794520,'Costa Rica','2004-09-21'),(2,1,'Pedro Palma','pedropalma@gmail.com','123456','5105105105105100',76554312,'Panama','2000-01-12'),(3,1,'Maria Perez','mariaperez@gmail.com','123456','5200828282828210',89760999,'Costa Rica','2003-04-11'),(4,1,'Cantarelo','cantarelo@gmail.com','123456','2223003122003222',54668907,'Colombia','1999-01-21');
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

-- Dump completed on 2025-03-24 12:43:38
