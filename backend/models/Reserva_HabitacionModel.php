<?php
class Reserva_HabitacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM reservahabitacion;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idReserva, $idHabitacion)
    {
        try {
            $vSql = "SELECT * FROM reservahabitacion 
                     WHERE idReserva = " . intval($idReserva) . " 
                       AND IdHabitacion = " . intval($idHabitacion) . ";";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
