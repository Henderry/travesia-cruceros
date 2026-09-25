<?php
/**
 * Crea la base de datos con bd.sql si todavía no existe.
 * Uso: php backend/tools/instalar-bd.php [ruta/bd.sql]
 * Toma la conexión de config.php (o de las variables de entorno).
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$config = require __DIR__ . '/../config.php';
$script = $argv[1] ?? __DIR__ . '/../../bd.sql';
$nombreBd = $config['DB_DBNAME'];

function conectar(array $c, ?string $bd)
{
    $link = mysqli_init();
    $flags = 0;
    if (filter_var($c['DB_SSL'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
        $link->ssl_set(null, null, $c['DB_SSL_CA'] ?? '/etc/ssl/certs/ca-certificates.crt', null, null);
        $flags = MYSQLI_CLIENT_SSL;
    }
    $link->real_connect($c['DB_HOST'], $c['DB_USERNAME'], $c['DB_PASSWORD'], $bd, (int) ($c['DB_PORT'] ?? 3306), null, $flags);
    $link->set_charset('utf8mb4');
    return $link;
}

// Separa el script en sentencias respetando DELIMITER (triggers y procedimientos)
function sentencias(string $sql): array
{
    $resultado = [];
    $delimitador = ';';
    $actual = '';
    foreach (preg_split('/\R/', $sql) as $linea) {
        $recortada = trim($linea);
        if (preg_match('/^DELIMITER\s+(\S+)$/i', $recortada, $m)) {
            $delimitador = $m[1];
            continue;
        }
        if ($actual === '' && ($recortada === '' || str_starts_with($recortada, '--'))) {
            continue;
        }
        $actual .= $linea . "\n";
        if (str_ends_with($recortada, $delimitador)) {
            $resultado[] = substr(rtrim($actual), 0, -strlen($delimitador));
            $actual = '';
        }
    }
    if (trim($actual) !== '') {
        $resultado[] = $actual;
    }
    return $resultado;
}

try {
    $servidor = conectar($config, null);
    $servidor->query("CREATE DATABASE IF NOT EXISTS `$nombreBd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    $servidor->close();

    $db = conectar($config, $nombreBd);
    // El último trigger del script indica que la base quedó completa
    $completa = $db->query("SHOW TRIGGERS WHERE `Trigger` = 'actualizar_precio_complemento_update'")->num_rows > 0;
    if ($completa) {
        echo "La base de datos $nombreBd ya existe.\n";
        exit(0);
    }

    // Si una instalación anterior quedó a medias, se empieza de cero
    $db->query('SET FOREIGN_KEY_CHECKS = 0');
    foreach ($db->query('SHOW TABLES')->fetch_all() as [$tabla]) {
        $db->query("DROP TABLE `$tabla`");
    }
    $db->query('SET FOREIGN_KEY_CHECKS = 1');
    $db->query('DROP PROCEDURE IF EXISTS recalcular_precio_reserva');

    $total = 0;
    foreach (sentencias(file_get_contents($script)) as $sentencia) {
        // La base la define la configuración, no el script
        if (preg_match('/^\s*(DROP DATABASE|CREATE DATABASE|USE)\b/i', $sentencia)) {
            continue;
        }
        $db->query($sentencia);
        $total++;
    }
    echo "Base de datos $nombreBd creada ($total sentencias).\n";
} catch (Throwable $e) {
    fwrite(STDERR, "No se pudo instalar la base de datos: " . $e->getMessage() . "\n");
    exit(1);
}
