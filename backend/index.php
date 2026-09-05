<?php
// Dependencias de Composer (JWT, PSR Log)
require_once 'vendor/autoload.php';

/* CORS: el frontend corre en otro puerto (Vite) */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

/* Núcleo */
require_once 'controllers/core/Config.php';
require_once 'controllers/core/HandleException.php';
require_once 'controllers/core/Logger.php';
require_once 'controllers/core/MySqlConnect.php';
require_once 'controllers/core/Request.php';
require_once 'controllers/core/Response.php';
require_once 'middleware/Auth.php';

/* Modelos */
require_once 'models/HabitacionModel.php';
require_once 'models/BarcoModel.php';
require_once 'models/Barco_HabitacionModel.php';
require_once 'models/ComplementoModel.php';
require_once 'models/CruceroModel.php';
require_once 'models/DestinoModel.php';
require_once 'models/FechasCruceroModel.php';
require_once 'models/HuespedModel.php';
require_once 'models/InfoPagoModel.php';
require_once 'models/ItinerarioModel.php';
require_once 'models/PuertoModel.php';
require_once 'models/Reserva_ComplementoModel.php';
require_once 'models/Reserva_HabitacionModel.php';
require_once 'models/ReservaModel.php';
require_once 'models/RolesUsuarioModel.php';
require_once 'models/UsuarioModel.php';
require_once 'models/ImageModel.php';
require_once 'models/ReporteModel.php';

/* Controladores */
require_once 'controllers/HabitacionController.php';
require_once 'controllers/BarcoController.php';
require_once 'controllers/Barco_HabitacionController.php';
require_once 'controllers/ComplementoController.php';
require_once 'controllers/CruceroController.php';
require_once 'controllers/DestinoController.php';
require_once 'controllers/FechasCruceroController.php';
require_once 'controllers/HuespedController.php';
require_once 'controllers/InfoPagoController.php';
require_once 'controllers/ItinerarioController.php';
require_once 'controllers/PuertoController.php';
require_once 'controllers/Reserva_ComplementoController.php';
require_once 'controllers/Reserva_HabitacionController.php';
require_once 'controllers/ReservaController.php';
require_once 'controllers/RolesUsuarioController.php';
require_once 'controllers/UsuarioController.php';
require_once 'controllers/ImageController.php';
require_once 'controllers/ReporteController.php';

/* Enrutador */
require_once 'routes/RoutesController.php';
$index = new RoutesController();
$index->index();
