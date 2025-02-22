<?php
class ReservaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT r.*, u.Nombre AS NombreUsuario, c.Nombre AS NombreCrucero, fc.FechaSalida
                    FROM reserva r
                    JOIN usuario u ON r.IdUsuario = u.Id
                    JOIN fechascrucero fc ON r.IdFechaCrucero = fc.Id
                    JOIN crucero c ON fc.IdCrucero = c.Id";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {

            //consulta general
            $vSql = "SELECT r.*, u.Nombre AS NombreUsuario, c.Nombre AS NombreCrucero, fc.FechaSalida
                    FROM reserva r
                    JOIN usuario u ON r.IdUsuario = u.Id
                    JOIN fechascrucero fc ON r.IdFechaCrucero = fc.Id
                    JOIN crucero c ON fc.IdCrucero = c.Id
                    WHERE r.Id = ". intval($id);
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            $vResultado = $vResultado[0];

                //consulta y calculo de fecha de regreso

            $vSql="SELECT 
                        DATE_ADD(fc.FechaSalida, INTERVAL fc.CantDias DAY) AS FechaVuelta
                    FROM 
                        fechascrucero fc
                    JOIN 
                        reserva r ON fc.Id = r.IdFechaCrucero
                    WHERE 
                        r.Id = ".intval($id).";";

            $FechaRegreso=$this->enlace->ExecuteSQL($vSql);
            $vResultado->FechaRegreso=$FechaRegreso[0]->FechaVuelta;

            //consulta del puerto de Salida

            $vSql ="SELECT p.Nombre AS NombrePuerto
                        FROM itinerario i
                        JOIN puerto p ON i.IdPuerto = p.Id
                        JOIN fechascrucero fc ON i.IdCrucero = fc.IdCrucero
                        JOIN reserva r ON fc.Id = r.IdFechaCrucero
                        WHERE r.Id = ".intval($id)."
                        ORDER BY i.Fecha asc
                        LIMIT 1;";
            
            $PuertoSalida=$this->enlace->ExecuteSQL($vSql);
            $vResultado->PuertoSalida=$PuertoSalida[0]->NombrePuerto;
            
            //consulta del puerto de vuelta

            $vSql ="SELECT p.Nombre AS NombrePuerto
                        FROM itinerario i
                        JOIN puerto p ON i.IdPuerto = p.Id
                        JOIN fechascrucero fc ON i.IdCrucero = fc.IdCrucero
                        JOIN reserva r ON fc.Id = r.IdFechaCrucero
                        WHERE r.Id = ".intval($id)."
                        ORDER BY i.Fecha desc
                        LIMIT 1;";
            
            $PuertoRegreso=$this->enlace->ExecuteSQL($vSql);
            $vResultado->PuertoRegreso=$PuertoRegreso[0]->NombrePuerto;




            //consulta de las habitaciones y pasajaeros x habitacion
            
            $vSql="SELECT 
                    h.Descripcion AS NombreHabitacion, 
                    rh.CantPasajeros AS CantidadHuespedes
                FROM 
                    reservahabitacion rh
                JOIN 
                    habitacion h ON rh.IdHabitacion = h.Id
                WHERE 
                    rh.idReserva = ".intval($id).";";

            $InfoHabitaciones=$this->enlace->ExecuteSQL($vSql);
            $vResultado->InfoHabitaciones=$InfoHabitaciones;



            //consulta para el precio total por las habitaciones reservadas
            $vSql="SELECT 
                        r.Id AS ReservaId,
                        SUM(phc.Precio) AS TotalPago
                    FROM 
                        reserva r
                    JOIN 
                        reservahabitacion rh ON r.Id = rh.IdReserva
                    JOIN 
                        precio_habitacion_crucero phc ON rh.IdHabitacion = phc.IdHabitacion
                    WHERE 
                        r.Id = ".intval($id)."  
                        AND phc.IdFechasCrucero = r.IdFechaCrucero  
                    GROUP BY 
                        r.Id;";

            // consulta para obtener lso complemetos de una reserva junto a su cantidad y precio total
            $PrecioTotalHabitaciones=$this->enlace->ExecuteSQL($vSql);
            $vResultado->PrecioTotalHabitacione=$PrecioTotalHabitaciones[0]->TotalPago;

            $vSql="SELECT 
                    c.Descripcion AS NombreComplemento, 
                    rc.Cantidad AS CantidadComplemento, 
                    (c.PrecioAplicado * rc.Cantidad) AS PrecioTotal
                FROM 
                    reserva_complemento rc
                JOIN 
                    complemento c ON rc.IdComplemento = c.Id
                WHERE 
                    rc.IdReserva = ".intval($id).";";
            
            $InfoComplementos=$this->enlace->ExecuteSQL($vSql);
            $vResultado->InfoComplementos=$InfoComplementos;
            

            //Impuestos y tarifas
            $vResultado->IVA=5;

            //Precio Final(Subtotal+IVA)
            $vSql="SELECT 
                    ((PrecioFinal * 0.05)+PrecioFinal) as PrecioTotal from reserva
                    where Id =".intval($id).";";

            $PrecioTotal=$this->enlace->ExecuteSQL($vSql);
            $vResultado->PrecioTotal=$PrecioTotal[0]->PrecioTotal;

            //consulta para verificra si el pago se hizo o no
            $vSql="SELECT 
                    CASE 
                        WHEN EXISTS (SELECT 1 FROM Infopago WHERE IdReserva = ".intval($id).") THEN 1
                        ELSE 0
                    END AS PagoExistente;";

            $EstadoPago=$this->enlace->ExecuteSQL($vSql);
            $vResultado->EstadoPago=$EstadoPago[0]->PagoExistente;


            //consulta a la fecha limite de pago en caso de que no se haya pagado
            if($EstadoPago[0]->PagoExistente == "0"){
                $vSql="SELECT fc.FechaLimitePago
                        FROM reserva r
                        JOIN fechascrucero fc ON r.IdFechaCrucero = fc.Id
                        WHERE r.Id = ".intval($id).";";
                $FechaLimitePago=$this->enlace->ExecuteSQL($vSql);
                $vResultado->FechaLimitePago=$FechaLimitePago[0]->FechaLimitePago;
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
