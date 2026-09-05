<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Autenticación con JWT (encabezado "Authorization: Bearer <token>").
 */
class Auth
{
    const DURACION_TOKEN = 60 * 60 * 8; // 8 horas
    const ROL_ADMIN = 'Administrador';

    private static $usuario = false;

    public static function generarToken($usuario)
    {
        $ahora = time();
        $payload = [
            'iat' => $ahora,
            'exp' => $ahora + self::DURACION_TOKEN,
            'sub' => (int) $usuario->id,
            'nombre' => $usuario->Nombre,
            'correo' => $usuario->Correo,
            'rol' => $usuario->Rol,
        ];
        return JWT::encode($payload, self::secreto(), 'HS256');
    }

    /**
     * Usuario del token de la solicitud actual, o null si no hay token válido.
     */
    public static function usuarioActual()
    {
        if (self::$usuario !== false) {
            return self::$usuario;
        }
        self::$usuario = null;
        $token = self::tokenDeLaSolicitud();
        if ($token) {
            try {
                $datos = JWT::decode($token, new Key(self::secreto(), 'HS256'));
                self::$usuario = (object) [
                    'id' => (int) $datos->sub,
                    'nombre' => $datos->nombre,
                    'correo' => $datos->correo,
                    'rol' => $datos->rol,
                ];
            } catch (Exception $e) {
                self::$usuario = null; // token vencido o alterado
            }
        }
        return self::$usuario;
    }

    public static function esAdmin()
    {
        $u = self::usuarioActual();
        return $u && $u->rol === self::ROL_ADMIN;
    }

    /** Corta la solicitud con 401 si no hay sesión. */
    public static function requerirLogin()
    {
        $u = self::usuarioActual();
        if (!$u) {
            self::responder(401, 'Debe iniciar sesión para continuar');
        }
        return $u;
    }

    /** Corta la solicitud con 403 si el usuario no es administrador. */
    public static function requerirAdmin()
    {
        $u = self::requerirLogin();
        if ($u->rol !== self::ROL_ADMIN) {
            self::responder(403, 'Esta acción requiere permisos de administrador');
        }
        return $u;
    }

    public static function responder($codigo, $mensaje)
    {
        http_response_code($codigo);
        echo json_encode(['status' => $codigo, 'message' => $mensaje]);
        exit;
    }

    private static function tokenDeLaSolicitud()
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';
        if (!$header && function_exists('getallheaders')) {
            foreach (getallheaders() as $nombre => $valor) {
                if (strtolower($nombre) === 'authorization') {
                    $header = $valor;
                }
            }
        }
        if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
            return $m[1];
        }
        return null;
    }

    private static function secreto()
    {
        return Config::get('SECRET_KEY');
    }
}
