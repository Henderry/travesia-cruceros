<?php
/**
 * Configuración local (config.php). Cada valor se puede definir también con una variable de entorno.
 */
return [
    'LOG_PATH'    => __DIR__ . '/Log',
    'DB_HOST'     => getenv('DB_HOST')     ?: 'localhost',
    'DB_USERNAME' => getenv('DB_USERNAME') ?: 'root',
    'DB_PASSWORD' => getenv('DB_PASSWORD') ?: '',
    'DB_DBNAME'   => getenv('DB_DBNAME')   ?: 'prueba1',
    // Clave para firmar los JWT
    'SECRET_KEY'  => getenv('SECRET_KEY')  ?: '82a9e228ad7b7c2c43e80a511a624eb62590cd5f8465945fa42d3037855ecc74',
];
