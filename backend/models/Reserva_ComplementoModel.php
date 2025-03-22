<?php
class ReservaComplemento
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM reserva_complemento;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idReserva, $idComplemento)
    {
        try {
            $vSql = "SELECT * FROM reserva_complemento 
                     WHERE IdReserva = " . intval($idReserva) . " 
                       AND IdComplemento = " . intval($idComplemento) . ";";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
