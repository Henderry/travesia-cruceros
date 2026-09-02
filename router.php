<?php
// Router para el servidor embebido de PHP: php -S localhost:8000 router.php
// El API queda en http://localhost:8000/api/<controlador>/<accion>
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = array_values(array_filter(explode('/', $path), 'strlen'));

// Archivos estáticos del backend (por ejemplo /api/uploads/foto.jpg)
if (count($parts) >= 2) {
    $file = __DIR__ . '/backend/' . implode('/', array_slice($parts, 1));
    if (is_file($file) && pathinfo($file, PATHINFO_EXTENSION) !== 'php') {
        header('Content-Type: ' . (mime_content_type($file) ?: 'application/octet-stream'));
        readfile($file);
        return true;
    }
}

// El primer segmento (/api) es la "carpeta" del API
$_SERVER['API_BASE'] = isset($parts[0]) ? '/' . $parts[0] : '';

chdir(__DIR__ . '/backend');
require __DIR__ . '/backend/index.php';
