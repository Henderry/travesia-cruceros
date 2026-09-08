<?php
class UsuarioModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    /** Campos públicos del usuario (nunca se devuelve la contraseña) */
    const CAMPOS = "u.id, u.Nombre, u.Correo, u.Telefono, u.Pais, u.FechaNacimiento,
                    u.FechaRegistro, u.IdRol, r.Descripcion AS Rol";

    public function all()
    {
        return $this->db->consultar(
            "SELECT " . self::CAMPOS . ",
                    (SELECT COUNT(*) FROM reserva WHERE IdUsuario = u.id) AS Reservas
             FROM usuario u JOIN rolususario r ON r.Id = u.IdRol
             ORDER BY u.FechaRegistro DESC"
        );
    }

    public function get($id)
    {
        return $this->db->consultarUno(
            "SELECT " . self::CAMPOS . " FROM usuario u JOIN rolususario r ON r.Id = u.IdRol WHERE u.id = ?",
            [(int) $id]
        );
    }

    /**
     * Verifica correo y contraseña. Devuelve el usuario (sin contraseña) o null.
     */
    public function login($correo, $contrasena)
    {
        $fila = $this->db->consultarUno(
            "SELECT " . self::CAMPOS . ", u.Contrasena
             FROM usuario u JOIN rolususario r ON r.Id = u.IdRol
             WHERE u.Correo = ?",
            [trim(strtolower($correo))]
        );
        if (!$fila || !password_verify($contrasena, $fila->Contrasena)) {
            return null;
        }
        unset($fila->Contrasena);
        return $fila;
    }

    public function existeCorreo($correo)
    {
        return (bool) $this->db->consultarUno(
            "SELECT id FROM usuario WHERE Correo = ?",
            [trim(strtolower($correo))]
        );
    }

    /**
     * Registra un cliente nuevo. La contraseña se guarda con password_hash (bcrypt).
     */
    public function registrar($datos)
    {
        $res = $this->db->ejecutar(
            "INSERT INTO usuario (IdRol, Nombre, Correo, Contrasena, Telefono, Pais, FechaNacimiento)
             VALUES (1, ?, ?, ?, ?, ?, ?)",
            [
                trim($datos->Nombre),
                trim(strtolower($datos->Correo)),
                password_hash($datos->Contrasena, PASSWORD_BCRYPT),
                $datos->Telefono ?? null,
                $datos->Pais ?? null,
                !empty($datos->FechaNacimiento) ? $datos->FechaNacimiento : null,
            ]
        );
        return $this->get($res['id']);
    }
}
