-- =====================================================================
-- Travesía Cruceros - Base de datos
-- Esquema, datos de ejemplo y triggers. Compatible con MySQL 8 y MariaDB 10.
--
-- Cuentas de demostración:
--   Administrador: admin@travesia.test   / Admin2026!
--   Cliente:       cliente@travesia.test / Cliente2026!
-- =====================================================================

DROP DATABASE IF EXISTS `prueba1`;
CREATE DATABASE `prueba1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `prueba1`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Usuarios y roles
-- ---------------------------------------------------------------------
CREATE TABLE `rolususario` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `IdRol` int NOT NULL DEFAULT 1,
  `Nombre` varchar(80) NOT NULL,
  `Correo` varchar(120) NOT NULL,
  `Contrasena` varchar(255) NOT NULL COMMENT 'Hash bcrypt (password_hash)',
  `Telefono` varchar(20) DEFAULT NULL,
  `Pais` varchar(45) DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `FechaRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Usuario_Correo_uq` (`Correo`),
  KEY `Usuario_Rol_idx` (`IdRol`),
  CONSTRAINT `Usuario_Rol` FOREIGN KEY (`IdRol`) REFERENCES `rolususario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- Catálogo: destinos, puertos, barcos y habitaciones
-- ---------------------------------------------------------------------
CREATE TABLE `destino` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Pais` varchar(45) NOT NULL,
  `Region` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `puerto` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(80) NOT NULL,
  `IdDestino` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Destino_Puerto_idx` (`IdDestino`),
  CONSTRAINT `DestinoPuerto` FOREIGN KEY (`IdDestino`) REFERENCES `destino` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `barco` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  `Capacidad` int DEFAULT NULL,
  `HabitacionesDisponibles` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `habitacion` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(200) DEFAULT NULL,
  `MinHuespedes` int DEFAULT NULL,
  `Tamano` float DEFAULT NULL,
  `Tipo` varchar(45) NOT NULL,
  `Precio` float DEFAULT NULL,
  `Disponibilidad` tinyint DEFAULT 1,
  `MaxHuespedes` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tipos de camarote';

CREATE TABLE `barco_habitacion` (
  `IdBarco` int NOT NULL,
  `IdHabitacion` int NOT NULL,
  `CantDisponible` int DEFAULT NULL,
  PRIMARY KEY (`IdBarco`,`IdHabitacion`),
  KEY `BarcoHabitacion_Habitacion_idx` (`IdHabitacion`),
  CONSTRAINT `BarcoHabitacion_Barco` FOREIGN KEY (`IdBarco`) REFERENCES `barco` (`Id`),
  CONSTRAINT `BarcoHabitacion_Habitacion` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `complemento` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Precio` float DEFAULT NULL COMMENT 'Precio regular',
  `Descripcion` varchar(80) NOT NULL,
  `PrecioAplicado` float DEFAULT NULL COMMENT 'Precio vigente que se cobra',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- Cruceros, itinerarios, salidas y precios
-- ---------------------------------------------------------------------
CREATE TABLE `crucero` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdBarco` int DEFAULT NULL,
  `Foto` varchar(100) DEFAULT NULL,
  `Nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Curcero_barco_idx` (`IdBarco`),
  CONSTRAINT `Curcero_barco` FOREIGN KEY (`IdBarco`) REFERENCES `barco` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `itinerario` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdPuerto` int DEFAULT NULL,
  `IdCrucero` int DEFAULT NULL,
  `Fecha` int DEFAULT NULL COMMENT 'Día del viaje',
  `Descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Itinerario_puerto_idx` (`IdPuerto`),
  KEY `Itinerario_crucero_idx` (`IdCrucero`),
  CONSTRAINT `Itinerario_crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`),
  CONSTRAINT `Itinerario_puerto` FOREIGN KEY (`IdPuerto`) REFERENCES `puerto` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `fechascrucero` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdCrucero` int DEFAULT NULL,
  `FechaSalida` date DEFAULT NULL,
  `FechaLimitePago` date DEFAULT NULL,
  `CantDias` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Crucero_Fechas_idx` (`IdCrucero`),
  CONSTRAINT `Crucero_Fechas` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `precio_habitacion_crucero` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdFechasCrucero` int DEFAULT NULL,
  `IdHabitacion` int DEFAULT NULL,
  `Precio` float DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `habitacion_precio_habitacion_crucero_idx` (`IdHabitacion`),
  KEY `fechascrucero_precio_habitacion_crucero_idx` (`IdFechasCrucero`),
  CONSTRAINT `fechascrucero_precio_habitacion_crucero` FOREIGN KEY (`IdFechasCrucero`) REFERENCES `fechascrucero` (`Id`),
  CONSTRAINT `habitacion_precio_habitacion_crucero` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- Reservas
-- ---------------------------------------------------------------------
CREATE TABLE `reserva` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdUsuario` int DEFAULT NULL,
  `IdCrucero` int DEFAULT NULL,
  `PrecioFinal` float DEFAULT NULL COMMENT 'Subtotal sin IVA (lo mantienen los triggers)',
  `IdFechaCrucero` int DEFAULT NULL,
  `FechaReserva` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Reserva_Crucero_idx` (`IdCrucero`),
  KEY `Reserva_Usuario_idx` (`IdUsuario`),
  KEY `Reserva_fechacrucero_idx` (`IdFechaCrucero`),
  CONSTRAINT `Reserva_Crucero` FOREIGN KEY (`IdCrucero`) REFERENCES `crucero` (`Id`),
  CONSTRAINT `Reserva_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `Reserva_fechacrucero` FOREIGN KEY (`IdFechaCrucero`) REFERENCES `fechascrucero` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reservahabitacion` (
  `idReserva` int NOT NULL,
  `IdHabitacion` int NOT NULL,
  `CantPasajeros` int DEFAULT NULL,
  PRIMARY KEY (`idReserva`,`IdHabitacion`),
  KEY `ReservaHabitacion_Habitacion_idx` (`IdHabitacion`),
  CONSTRAINT `ReservaHabitacion_Habitacion` FOREIGN KEY (`IdHabitacion`) REFERENCES `habitacion` (`Id`),
  CONSTRAINT `ReservaHabitacion_Reserva` FOREIGN KEY (`idReserva`) REFERENCES `reserva` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reserva_complemento` (
  `IdReserva` int NOT NULL,
  `IdComplemento` int NOT NULL,
  `Cantidad` int DEFAULT NULL,
  PRIMARY KEY (`IdReserva`,`IdComplemento`),
  KEY `ReservaComplemento_Complemento_idx` (`IdComplemento`),
  CONSTRAINT `ReservaComplemento_Complemento` FOREIGN KEY (`IdComplemento`) REFERENCES `complemento` (`Id`),
  CONSTRAINT `ReservaComplemento_Reserva` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `huesped` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdReserva` int DEFAULT NULL,
  `Nombre` varchar(80) DEFAULT NULL,
  `Sexo` varchar(10) DEFAULT NULL,
  `Edad` int DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Reserva_Huespedes_idx` (`IdReserva`),
  CONSTRAINT `Reserva_Huespedes` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `infopago` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdReserva` int DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Monto` float DEFAULT NULL COMMENT 'Monto pagado con IVA',
  PRIMARY KEY (`Id`),
  KEY `InfoPago_Reserva_idx` (`IdReserva`),
  CONSTRAINT `InfoPago_Reserva` FOREIGN KEY (`IdReserva`) REFERENCES `reserva` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================================
-- Datos de ejemplo
-- =====================================================================
INSERT INTO `rolususario` (`Id`, `Descripcion`) VALUES
  (1, 'Cliente'),
  (2, 'Administrador');
INSERT INTO `usuario` (`id`, `IdRol`, `Nombre`, `Correo`, `Contrasena`, `Telefono`, `Pais`, `FechaNacimiento`) VALUES
  (1, 2, 'Administrador Travesía', 'admin@travesia.test', '$2y$10$d0jLhrgVScziooW.YRLrTeG7FsYBJQrLDGxNpV4hNX3DHJr4n8ZTy', '22223333', 'Costa Rica', '1990-05-14'),
  (2, 1, 'Laura Méndez', 'cliente@travesia.test', '$2y$10$X18YGpeWRXffckKmXvBWRu0Spr7BJ8O5yGVa4AGfqyF97LJaWYNZ2', '88887777', 'Costa Rica', '1994-02-03'),
  (3, 1, 'Pedro Palma', 'pedro.palma@travesia.test', '$2y$10$X18YGpeWRXffckKmXvBWRu0Spr7BJ8O5yGVa4AGfqyF97LJaWYNZ2', '76554312', 'Panamá', '1988-01-12'),
  (4, 1, 'María Pérez', 'maria.perez@travesia.test', '$2y$10$X18YGpeWRXffckKmXvBWRu0Spr7BJ8O5yGVa4AGfqyF97LJaWYNZ2', '89760999', 'Costa Rica', '1996-04-11'),
  (5, 1, 'Carlos Rojas', 'carlos.rojas@travesia.test', '$2y$10$X18YGpeWRXffckKmXvBWRu0Spr7BJ8O5yGVa4AGfqyF97LJaWYNZ2', '54668907', 'Colombia', '1985-09-21');
INSERT INTO `destino` (`Id`, `Pais`, `Region`) VALUES
  (1, 'Costa Rica', 'Caribe - Limón'),
  (2, 'Costa Rica', 'Pacífico - Guanacaste'),
  (3, 'Panamá', 'Colón'),
  (4, 'Colombia', 'Cartagena de Indias'),
  (5, 'México', 'Cozumel'),
  (6, 'Nicaragua', 'San Juan del Sur');
INSERT INTO `puerto` (`Id`, `Nombre`, `IdDestino`) VALUES
  (1, 'Terminal de Cruceros de Limón', 1),
  (2, 'Puerto de Playas del Coco', 2),
  (3, 'Terminal Colón 2000', 3),
  (4, 'Terminal de Cruceros de Cartagena', 4),
  (5, 'Muelle Punta Langosta', 5),
  (6, 'Bahía de San Juan del Sur', 6);
INSERT INTO `barco` (`Id`, `Nombre`, `Descripcion`, `Capacidad`, `HabitacionesDisponibles`) VALUES
  (1, 'Aurora del Caribe', 'Barco insignia con teatro, spa y 3 piscinas', 2400, 1160),
  (2, 'Estrella del Pacífico', 'Moderno, ideal para familias y parejas', 1800, 840),
  (3, 'Brisa Tropical', 'Íntimo y elegante, enfocado en gastronomía', 950, 405),
  (4, 'Horizonte Azul', 'Aventura y deportes acuáticos a bordo', 1500, 680);
INSERT INTO `habitacion` (`Id`, `Descripcion`, `MinHuespedes`, `Tamano`, `Tipo`, `Precio`, `Disponibilidad`, `MaxHuespedes`) VALUES
  (1, 'Camarote interior acogedor con cama queen o dos camas individuales. La mejor relación precio-comodidad.', 1, 14, 'Interior', 385000, 1, 2),
  (2, 'Camarote con ventana panorámica al mar, área de descanso y baño privado.', 1, 18, 'Vista al mar', 495000, 1, 3),
  (3, 'Camarote con balcón privado amueblado para disfrutar de cada atardecer en altamar.', 1, 22, 'Balcón', 640000, 1, 4),
  (4, 'Suite con sala independiente, balcón amplio, bañera y servicio de mayordomo.', 2, 42, 'Suite', 1150000, 1, 4);
INSERT INTO `barco_habitacion` (`IdBarco`, `IdHabitacion`, `CantDisponible`) VALUES
  (1, 1, 420),
  (1, 2, 380),
  (1, 3, 300),
  (1, 4, 60),
  (2, 1, 300),
  (2, 2, 280),
  (2, 3, 220),
  (2, 4, 40),
  (3, 2, 160),
  (3, 3, 200),
  (3, 4, 45),
  (4, 1, 260),
  (4, 2, 240),
  (4, 3, 180);
INSERT INTO `complemento` (`Id`, `Precio`, `Descripcion`, `PrecioAplicado`) VALUES
  (1, 52000, 'Paquete de bebidas premium', 45000),
  (2, 38000, 'Circuito de spa y masaje', 38000),
  (3, 35000, 'Excursión guiada en tierra', 32000),
  (4, 18000, 'Internet a bordo (todo el viaje)', 15000),
  (5, 29000, 'Cena en restaurante de especialidad', 29000);
INSERT INTO `crucero` (`Id`, `IdBarco`, `Foto`, `Nombre`) VALUES
  (1, 1, 'joyas-del-caribe.jpg', 'Joyas del Caribe'),
  (2, 2, 'pacifico-dorado.jpg', 'Pacífico Dorado'),
  (3, 3, 'ruta-del-canal.jpg', 'Ruta del Canal'),
  (4, 1, 'caribe-colonial.jpg', 'Caribe Colonial'),
  (5, 4, 'escapada-tropical.jpg', 'Escapada Tropical'),
  (6, 2, 'maravillas-mayas.jpg', 'Maravillas Mayas');
INSERT INTO `itinerario` (`Id`, `IdPuerto`, `IdCrucero`, `Fecha`, `Descripcion`) VALUES
  (1, 1, 1, 1, 'Embarque en Limón y bienvenida a bordo'),
  (2, 3, 1, 3, 'Colón: visita a las esclusas de Agua Clara'),
  (3, 4, 1, 5, 'Cartagena: tour por la ciudad amurallada'),
  (4, 1, 1, 7, 'Regreso a Limón'),
  (5, 2, 2, 1, 'Embarque en Playas del Coco'),
  (6, 6, 2, 3, 'San Juan del Sur: playas y surf'),
  (7, 2, 2, 5, 'Regreso a Guanacaste'),
  (8, 3, 3, 1, 'Embarque en Colón 2000'),
  (9, 3, 3, 2, 'Tránsito parcial por el Canal de Panamá'),
  (10, 4, 3, 4, 'Cartagena: Getsemaní y el Castillo San Felipe'),
  (11, 1, 3, 6, 'Limón: selva y playas del Caribe sur'),
  (12, 3, 3, 8, 'Regreso a Colón'),
  (13, 1, 4, 1, 'Embarque en Limón'),
  (14, 4, 4, 3, 'Cartagena: noche de salsa en la ciudad vieja'),
  (15, 1, 4, 6, 'Regreso a Limón'),
  (16, 2, 5, 1, 'Embarque en Playas del Coco'),
  (17, 6, 5, 2, 'San Juan del Sur: kayak y snorkel'),
  (18, 2, 5, 4, 'Regreso a Guanacaste'),
  (19, 1, 6, 1, 'Embarque en Limón'),
  (20, 5, 6, 4, 'Cozumel: arrecifes y ruinas mayas'),
  (21, 3, 6, 7, 'Colón: compras en zona libre'),
  (22, 1, 6, 9, 'Regreso a Limón');
INSERT INTO `fechascrucero` (`Id`, `IdCrucero`, `FechaSalida`, `FechaLimitePago`, `CantDias`) VALUES
  (1, 1, '2026-11-14', '2026-10-24', 7),
  (2, 1, '2027-01-09', '2026-12-19', 7),
  (3, 1, '2027-03-20', '2027-02-27', 7),
  (4, 2, '2026-12-05', '2026-11-14', 5),
  (5, 2, '2027-02-13', '2027-01-23', 5),
  (6, 3, '2027-01-23', '2027-01-02', 8),
  (7, 3, '2027-04-10', '2027-03-20', 8),
  (8, 4, '2026-11-28', '2026-11-07', 6),
  (9, 4, '2027-02-27', '2027-02-06', 6),
  (10, 5, '2026-12-19', '2026-11-28', 4),
  (11, 5, '2027-03-06', '2027-02-13', 4),
  (12, 6, '2027-01-30', '2027-01-09', 9),
  (13, 6, '2027-05-01', '2027-04-10', 9);
INSERT INTO `precio_habitacion_crucero` (`Id`, `IdFechasCrucero`, `IdHabitacion`, `Precio`) VALUES
  (1, 1, 1, 385000),
  (2, 1, 2, 495000),
  (3, 1, 3, 640000),
  (4, 1, 4, 1150000),
  (5, 2, 1, 425000),
  (6, 2, 2, 545000),
  (7, 2, 3, 705000),
  (8, 2, 4, 1265000),
  (9, 3, 1, 415000),
  (10, 3, 2, 535000),
  (11, 3, 3, 690000),
  (12, 3, 4, 1240000),
  (13, 4, 1, 325000),
  (14, 4, 2, 415000),
  (15, 4, 3, 540000),
  (16, 4, 4, 970000),
  (17, 5, 1, 290000),
  (18, 5, 2, 370000),
  (19, 5, 3, 480000),
  (20, 5, 4, 860000),
  (21, 6, 2, 620000),
  (22, 6, 3, 805000),
  (23, 6, 4, 1445000),
  (24, 7, 2, 535000),
  (25, 7, 3, 695000),
  (26, 7, 4, 1250000),
  (27, 8, 1, 330000),
  (28, 8, 2, 425000),
  (29, 8, 3, 550000),
  (30, 8, 4, 985000),
  (31, 9, 1, 345000),
  (32, 9, 2, 445000),
  (33, 9, 3, 575000),
  (34, 9, 4, 1035000),
  (35, 10, 1, 260000),
  (36, 10, 2, 335000),
  (37, 10, 3, 430000),
  (38, 11, 1, 240000),
  (39, 11, 2, 305000),
  (40, 11, 3, 395000),
  (41, 12, 1, 545000),
  (42, 12, 2, 700000),
  (43, 12, 3, 905000),
  (44, 12, 4, 1625000),
  (45, 13, 1, 455000),
  (46, 13, 2, 585000),
  (47, 13, 3, 755000),
  (48, 13, 4, 1360000);
INSERT INTO `reserva` (`Id`, `IdUsuario`, `IdCrucero`, `PrecioFinal`, `IdFechaCrucero`, `FechaReserva`) VALUES
  (1, 2, 1, 794000, 1, '2026-08-02 10:15:00'),
  (2, 3, 2, 755000, 4, '2026-08-19 16:40:00'),
  (3, 4, 3, 1579000, 6, '2026-09-03 09:05:00'),
  (4, 5, 4, 330000, 8, '2026-09-10 20:30:00'),
  (5, 2, 6, 1001000, 12, '2026-09-15 12:00:00');
INSERT INTO `reservahabitacion` (`idReserva`, `IdHabitacion`, `CantPasajeros`) VALUES
  (1, 3, 2),
  (2, 2, 2),
  (2, 1, 1),
  (3, 4, 2),
  (4, 1, 2),
  (5, 3, 3);
INSERT INTO `reserva_complemento` (`IdReserva`, `IdComplemento`, `Cantidad`) VALUES
  (1, 1, 2),
  (1, 3, 2),
  (2, 4, 1),
  (3, 2, 2),
  (3, 5, 2),
  (5, 3, 3);
INSERT INTO `huesped` (`Id`, `IdReserva`, `Nombre`, `Sexo`, `Edad`, `Telefono`) VALUES
  (1, 1, 'Laura Méndez', 'F', 37, NULL),
  (2, 1, 'Andrés Solís', 'M', 44, NULL),
  (3, 2, 'Pedro Palma', 'M', 51, NULL),
  (4, 2, 'Ana Palma', 'F', 33, NULL),
  (5, 2, 'Tomás Palma', 'M', 40, NULL),
  (6, 3, 'María Pérez', 'F', 47, NULL),
  (7, 3, 'José Vargas', 'M', 54, NULL),
  (8, 4, 'Carlos Rojas', 'M', 36, NULL),
  (9, 4, 'Daniela Rojas', 'F', 43, NULL),
  (10, 5, 'Laura Méndez', 'F', 50, NULL),
  (11, 5, 'Sofía Méndez', 'F', 32, NULL),
  (12, 5, 'Diego Méndez', 'M', 39, NULL);
INSERT INTO `infopago` (`Id`, `IdReserva`, `Fecha`, `Monto`) VALUES
  (1, 1, '2026-08-02', 897220.0),
  (2, 2, '2026-08-19', 853150.0);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Triggers
-- Mantienen las habitaciones disponibles de cada barco y el precio final
-- de cada reserva (habitaciones + complementos, sin IVA).
-- =====================================================================
DELIMITER $$

CREATE TRIGGER actualizar_habitaciones_disponibles
AFTER INSERT ON barco_habitacion
FOR EACH ROW
BEGIN
    UPDATE barco
    SET HabitacionesDisponibles = (SELECT COALESCE(SUM(CantDisponible), 0) FROM barco_habitacion WHERE IdBarco = NEW.IdBarco)
    WHERE Id = NEW.IdBarco;
END$$

CREATE TRIGGER actualizar_habitaciones_modificadas
AFTER UPDATE ON barco_habitacion
FOR EACH ROW
BEGIN
    UPDATE barco
    SET HabitacionesDisponibles = (SELECT COALESCE(SUM(CantDisponible), 0) FROM barco_habitacion WHERE IdBarco = OLD.IdBarco)
    WHERE Id = OLD.IdBarco;
    IF NEW.IdBarco != OLD.IdBarco THEN
        UPDATE barco
        SET HabitacionesDisponibles = (SELECT COALESCE(SUM(CantDisponible), 0) FROM barco_habitacion WHERE IdBarco = NEW.IdBarco)
        WHERE Id = NEW.IdBarco;
    END IF;
END$$

CREATE TRIGGER actualizar_habitaciones_eliminadas
AFTER DELETE ON barco_habitacion
FOR EACH ROW
BEGIN
    UPDATE barco
    SET HabitacionesDisponibles = (SELECT COALESCE(SUM(CantDisponible), 0) FROM barco_habitacion WHERE IdBarco = OLD.IdBarco)
    WHERE Id = OLD.IdBarco;
END$$

CREATE TRIGGER eliminar_precios_habitacion
BEFORE DELETE ON fechascrucero
FOR EACH ROW
BEGIN
    DELETE FROM precio_habitacion_crucero WHERE IdFechasCrucero = OLD.Id;
END$$

CREATE PROCEDURE recalcular_precio_reserva(IN p_reserva INT)
BEGIN
    -- Precio final = tarifa de cada camarote en la fecha reservada + complementos
    UPDATE reserva r
    SET r.PrecioFinal =
        (SELECT COALESCE(SUM(phc.Precio), 0)
           FROM reservahabitacion rh
           JOIN precio_habitacion_crucero phc
             ON phc.IdHabitacion = rh.IdHabitacion AND phc.IdFechasCrucero = r.IdFechaCrucero
          WHERE rh.idReserva = r.Id)
      + (SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
           FROM reserva_complemento rc
           JOIN complemento c ON c.Id = rc.IdComplemento
          WHERE rc.IdReserva = r.Id)
    WHERE r.Id = p_reserva;
END$$

CREATE TRIGGER actualizar_precio_habitacion
AFTER INSERT ON reservahabitacion
FOR EACH ROW
BEGIN
    CALL recalcular_precio_reserva(NEW.idReserva);
END$$

CREATE TRIGGER actualizar_precio_habitacion_update
AFTER UPDATE ON reservahabitacion
FOR EACH ROW
BEGIN
    CALL recalcular_precio_reserva(NEW.idReserva);
END$$

CREATE TRIGGER actualizar_precio_complemento
AFTER INSERT ON reserva_complemento
FOR EACH ROW
BEGIN
    CALL recalcular_precio_reserva(NEW.IdReserva);
END$$

CREATE TRIGGER actualizar_precio_complemento_update
AFTER UPDATE ON reserva_complemento
FOR EACH ROW
BEGIN
    CALL recalcular_precio_reserva(NEW.IdReserva);
END$$

DELIMITER ;
