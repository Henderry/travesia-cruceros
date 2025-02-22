<?php
class BarcoHabitacion
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener todos los registros de la tabla barco_habitacion
    public function all()
    {
        try {
            $vSql = "SELECT * FROM barco_habitacion;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener un registro específico dado IdBarco y IdHabitacion
    public function get($idBarco, $idHabitacion)
    {
        try {
            $vSql = "SELECT * FROM barco_habitacion 
                     WHERE IdBarco = " . intval($idBarco) . " 
                       AND IdHabitacion = " . intval($idHabitacion) . ";";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
