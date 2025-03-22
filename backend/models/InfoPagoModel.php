<?php
class InfoPagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM infopago;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM infopago WHERE Id = " . intval($id) . ";";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($idReserva)
    {
        try {
            // Validar existencia de la reserva
            $vSql = "SELECT Id FROM reserva WHERE Id = " . intval($idReserva);
            $existeReserva = $this->enlace->ExecuteSQL($vSql);
            
            if(empty($existeReserva)) {
                throw new Exception("Reserva no encontrada");
            }
    
            // Insertar en infopago (CORRECCIÓN: FechaPago -> Fecha)
            $vSql = "INSERT INTO infopago (IdReserva, Fecha) 
                   VALUES (".intval($idReserva).", CURDATE())";
            
            $this->enlace->executeSQL_DML($vSql);
            return true;
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
