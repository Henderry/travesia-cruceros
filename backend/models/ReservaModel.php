<?php
class ReservaModel
{
    // IVA de Costa Rica
    const IVA_PORCENTAJE = 13;

    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    private static function iva($subtotal)
    {
        return round($subtotal * self::IVA_PORCENTAJE / 100, 2);
    }

    /**
     * Listado de reservas. Si se indica $idUsuario, solo las de ese cliente.
     */
    public function all($idUsuario = null)
    {
        $sql = "SELECT r.Id, r.IdUsuario, u.Nombre AS NombreUsuario, r.IdCrucero,
                       c.Nombre AS NombreCrucero, c.Foto, r.IdFechaCrucero,
                       fc.FechaSalida, fc.CantDias, fc.FechaLimitePago, r.FechaReserva,
                       r.PrecioFinal AS Subtotal,
                       (SELECT COALESCE(SUM(CantPasajeros), 0) FROM reservahabitacion WHERE idReserva = r.Id) AS Pasajeros,
                       EXISTS (SELECT 1 FROM infopago p WHERE p.IdReserva = r.Id) AS Pagada
                FROM reserva r
                JOIN usuario u ON u.id = r.IdUsuario
                JOIN crucero c ON c.Id = r.IdCrucero
                JOIN fechascrucero fc ON fc.Id = r.IdFechaCrucero";
        $params = [];
        if ($idUsuario !== null) {
            $sql .= " WHERE r.IdUsuario = ?";
            $params[] = (int) $idUsuario;
        }
        $sql .= " ORDER BY r.FechaReserva DESC";

        $filas = $this->db->consultar($sql, $params);
        foreach ($filas as $f) {
            $f->Subtotal = (float) $f->Subtotal;
            $f->IVA = self::iva($f->Subtotal);
            $f->Total = round($f->Subtotal + $f->IVA, 2);
            $f->Pagada = (bool) $f->Pagada;
        }
        return $filas;
    }

    /**
     * Detalle completo de una reserva: viaje, habitaciones, complementos,
     * huéspedes, montos e información de pago.
     */
    public function get($id)
    {
        $id = (int) $id;
        $r = $this->db->consultarUno(
            "SELECT r.Id, r.IdUsuario, u.Nombre AS NombreUsuario, u.Correo AS CorreoUsuario,
                    r.IdCrucero, c.Nombre AS NombreCrucero, c.Foto, b.Nombre AS NombreBarco,
                    r.IdFechaCrucero, fc.FechaSalida, fc.CantDias, fc.FechaLimitePago,
                    DATE_ADD(fc.FechaSalida, INTERVAL fc.CantDias DAY) AS FechaRegreso,
                    r.FechaReserva, r.PrecioFinal AS Subtotal
             FROM reserva r
             JOIN usuario u ON u.id = r.IdUsuario
             JOIN crucero c ON c.Id = r.IdCrucero
             LEFT JOIN barco b ON b.Id = c.IdBarco
             JOIN fechascrucero fc ON fc.Id = r.IdFechaCrucero
             WHERE r.Id = ?",
            [$id]
        );
        if (!$r) {
            return null;
        }

        $puertos = $this->db->consultar(
            "SELECT p.Nombre FROM itinerario i JOIN puerto p ON p.Id = i.IdPuerto
             WHERE i.IdCrucero = ? ORDER BY i.Fecha",
            [(int) $r->IdCrucero]
        );
        $r->PuertoSalida = $puertos ? $puertos[0]->Nombre : null;
        $r->PuertoRegreso = $puertos ? end($puertos)->Nombre : null;

        $r->Habitaciones = $this->db->consultar(
            "SELECT rh.IdHabitacion, h.Tipo, h.Descripcion, rh.CantPasajeros,
                    COALESCE(phc.Precio, 0) AS Precio
             FROM reservahabitacion rh
             JOIN habitacion h ON h.Id = rh.IdHabitacion
             LEFT JOIN precio_habitacion_crucero phc
                    ON phc.IdHabitacion = rh.IdHabitacion AND phc.IdFechasCrucero = ?
             WHERE rh.idReserva = ?",
            [(int) $r->IdFechaCrucero, $id]
        );

        $r->Complementos = $this->db->consultar(
            "SELECT rc.IdComplemento, c.Descripcion, rc.Cantidad,
                    c.PrecioAplicado AS PrecioUnitario,
                    (c.PrecioAplicado * rc.Cantidad) AS Total
             FROM reserva_complemento rc
             JOIN complemento c ON c.Id = rc.IdComplemento
             WHERE rc.IdReserva = ?",
            [$id]
        );

        $r->Huespedes = $this->db->consultar(
            "SELECT Nombre, Sexo, Edad, Telefono FROM huesped WHERE IdReserva = ? ORDER BY Id",
            [$id]
        );

        $pago = $this->db->consultarUno(
            "SELECT Fecha, Monto FROM infopago WHERE IdReserva = ? ORDER BY Id DESC LIMIT 1",
            [$id]
        );

        $r->Subtotal = (float) $r->Subtotal;
        $r->TotalHabitaciones = array_sum(array_map(fn($h) => (float) $h->Precio, $r->Habitaciones));
        $r->TotalComplementos = array_sum(array_map(fn($c) => (float) $c->Total, $r->Complementos));
        $r->IVAPorcentaje = self::IVA_PORCENTAJE;
        $r->IVA = self::iva($r->Subtotal);
        $r->Total = round($r->Subtotal + $r->IVA, 2);
        $r->Pagada = (bool) $pago;
        $r->FechaPago = $pago->Fecha ?? null;
        $r->MontoPagado = $pago ? (float) $pago->Monto : 0;
        return $r;
    }

    /**
     * Crea una reserva con habitaciones, complementos y huéspedes en una sola
     * transacción. El precio lo calculan los triggers de la base de datos a partir
     * de la tarifa de la fecha elegida, así que el cliente no puede alterarlo.
     */
    public function create($idUsuario, $datos)
    {
        $idCrucero = (int) ($datos->IdCrucero ?? 0);
        $idFecha = (int) ($datos->IdFechaCrucero ?? 0);

        $fecha = $this->db->consultarUno(
            "SELECT Id, FechaSalida FROM fechascrucero WHERE Id = ? AND IdCrucero = ?",
            [$idFecha, $idCrucero]
        );
        if (!$fecha) {
            Auth::responder(422, 'La fecha seleccionada no corresponde al crucero');
        }
        if ($fecha->FechaSalida <= date('Y-m-d')) {
            Auth::responder(422, 'Esa salida ya no está disponible para reservar');
        }

        // Agrupar habitaciones del mismo tipo (la llave primaria es reserva + tipo)
        $porTipo = [];
        foreach (($datos->Habitaciones ?? []) as $h) {
            $tipo = (int) $h->IdHabitacion;
            $porTipo[$tipo] = ($porTipo[$tipo] ?? 0) + max(1, (int) $h->CantPasajeros);
        }
        if (!$porTipo) {
            Auth::responder(422, 'La reserva debe incluir al menos una habitación');
        }
        foreach (array_keys($porTipo) as $tipo) {
            $tarifa = $this->db->consultarUno(
                "SELECT Id FROM precio_habitacion_crucero WHERE IdFechasCrucero = ? AND IdHabitacion = ?",
                [$idFecha, $tipo]
            );
            if (!$tarifa) {
                Auth::responder(422, 'Uno de los camarotes no está disponible en esta salida');
            }
        }

        $complementos = [];
        foreach (($datos->Complementos ?? []) as $c) {
            $cant = (int) $c->Cantidad;
            if ($cant > 0) {
                $complementos[(int) $c->IdComplemento] = ($complementos[(int) $c->IdComplemento] ?? 0) + $cant;
            }
        }

        try {
            $this->db->beginTransaction();

            $idReserva = $this->db->ejecutar(
                "INSERT INTO reserva (IdUsuario, IdCrucero, IdFechaCrucero, PrecioFinal) VALUES (?, ?, ?, 0)",
                [(int) $idUsuario, $idCrucero, $idFecha]
            )['id'];

            foreach ($porTipo as $tipo => $pasajeros) {
                $this->db->ejecutar(
                    "INSERT INTO reservahabitacion (idReserva, IdHabitacion, CantPasajeros) VALUES (?, ?, ?)",
                    [$idReserva, $tipo, $pasajeros]
                );
            }
            foreach ($complementos as $idComp => $cant) {
                $this->db->ejecutar(
                    "INSERT INTO reserva_complemento (IdReserva, IdComplemento, Cantidad) VALUES (?, ?, ?)",
                    [$idReserva, $idComp, $cant]
                );
            }
            foreach (($datos->Huespedes ?? []) as $h) {
                if (empty(trim($h->Nombre ?? ''))) {
                    continue;
                }
                $this->db->ejecutar(
                    "INSERT INTO huesped (IdReserva, Nombre, Sexo, Edad, Telefono) VALUES (?, ?, ?, ?, ?)",
                    [$idReserva, trim($h->Nombre), $h->Sexo ?? null,
                     isset($h->Edad) && $h->Edad !== '' ? (int) $h->Edad : null, $h->Telefono ?? null]
                );
            }

            // Precio final = tarifas de la fecha + complementos (misma regla que los triggers)
            $this->db->ejecutar(
                "UPDATE reserva r
                 SET r.PrecioFinal =
                     (SELECT COALESCE(SUM(phc.Precio), 0)
                        FROM reservahabitacion rh
                        JOIN precio_habitacion_crucero phc
                          ON phc.IdHabitacion = rh.IdHabitacion AND phc.IdFechasCrucero = r.IdFechaCrucero
                       WHERE rh.idReserva = r.Id)
                   + (SELECT COALESCE(SUM(c.PrecioAplicado * rc.Cantidad), 0)
                        FROM reserva_complemento rc
                        JOIN complemento c ON c.Id = rc.IdComplemento
                       WHERE rc.IdReserva = r.Id)
                 WHERE r.Id = ?",
                [$idReserva]
            );

            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollback();
            handleException($e);
        }

        return $this->get($idReserva);
    }
}
