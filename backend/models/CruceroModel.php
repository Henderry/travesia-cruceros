<?php
class CruceroModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT 
                        c.*, 
                        MAX(fc.FechaSalida) AS FechaMasReciente,
                        SUM(fc.CantDias) AS TotalDias
                    FROM crucero c
                    LEFT JOIN fechascrucero fc ON c.Id = fc.IdCrucero
                    GROUP BY c.Id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT c.*, b.Nombre AS NombreBarco, 
                        COALESCE(SUM(f.CantDias), 0) AS TotalDias
                    FROM crucero c
                    JOIN barco b ON c.IdBarco = b.Id
                    LEFT JOIN fechascrucero f ON c.Id = f.IdCrucero
                    WHERE c.Id = ". intval($id) .
                    " GROUP BY c.Id";




            $vResultado = $this->enlace->ExecuteSQL($vSql);
            $crucero = $vResultado[0];
            return $crucero;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getItinerarioById($id)
    {
        try {
            $vSql = "SELECT 
                    i.*, 
                    p.Nombre AS NombrePuerto
                    FROM itinerario i
                    INNER JOIN puerto p ON i.IdPuerto = p.Id
                    WHERE i.IdCrucero = " . intval($id) . " ORDER BY i.Fecha DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getFechasCruceroById($id)
    {
        try {
            $vSql = "SELECT * 
                    FROM fechascrucero 
                    WHERE IdCrucero = " . intval($id) . " ORDER BY FechaSalida DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            

            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i < count($vResultado); $i++) { 
                    $vSql2 = "SELECT phc.*, h.Tipo AS TipoHabitacion
                                FROM precio_habitacion_crucero phc
                                JOIN habitacion h ON phc.IdHabitacion = h.Id
                                WHERE phc.IdFechasCrucero = " . intval($vResultado[$i]->Id) . ";";
                    $VRes=$this->enlace->ExecuteSQL($vSql2);
                    $vResultado[$i]->precio_habitacion_crucero=$VRes;

                    
                }
            }



            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
