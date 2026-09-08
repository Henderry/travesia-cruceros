<?php
/** Indicadores para el panel de administración */
class ReporteModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function resumen()
    {
        $iva = 1 + ReservaModel::IVA_PORCENTAJE / 100;
        $kpi = $this->db->consultarUno(
            "SELECT
                (SELECT COUNT(*) FROM reserva) AS Reservas,
                (SELECT COALESCE(SUM(CantPasajeros), 0) FROM reservahabitacion) AS Pasajeros,
                (SELECT COALESCE(SUM(Monto), 0) FROM infopago) AS Cobrado,
                (SELECT COALESCE(SUM(r.PrecioFinal), 0) FROM reserva r
                  WHERE NOT EXISTS (SELECT 1 FROM infopago p WHERE p.IdReserva = r.Id)) AS PendienteSubtotal,
                (SELECT COUNT(*) FROM usuario WHERE IdRol = 1) AS Clientes,
                (SELECT COUNT(*) FROM fechascrucero WHERE FechaSalida > CURDATE()) AS SalidasProximas"
        );
        $kpi->Pendiente = round($kpi->PendienteSubtotal * $iva, 2);
        unset($kpi->PendienteSubtotal);

        $porCrucero = $this->db->consultar(
            "SELECT c.Id, c.Nombre, COUNT(r.Id) AS Reservas,
                    COALESCE(SUM(r.PrecioFinal), 0) AS Subtotal
             FROM crucero c LEFT JOIN reserva r ON r.IdCrucero = c.Id
             GROUP BY c.Id, c.Nombre
             ORDER BY Subtotal DESC"
        );
        foreach ($porCrucero as $c) {
            $c->Ingresos = round($c->Subtotal * $iva, 2);
            unset($c->Subtotal);
        }

        $proximas = $this->db->consultar(
            "SELECT fc.Id, c.Nombre AS Crucero, fc.FechaSalida, fc.CantDias,
                    (SELECT COUNT(*) FROM reserva r WHERE r.IdFechaCrucero = fc.Id) AS Reservas
             FROM fechascrucero fc JOIN crucero c ON c.Id = fc.IdCrucero
             WHERE fc.FechaSalida > CURDATE()
             ORDER BY fc.FechaSalida LIMIT 5"
        );

        return [
            'Indicadores' => $kpi,
            'PorCrucero' => $porCrucero,
            'ProximasSalidas' => $proximas,
            'UltimasReservas' => array_slice((new ReservaModel())->all(), 0, 6),
        ];
    }
}
