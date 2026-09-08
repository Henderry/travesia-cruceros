<?php
class CruceroModel
{
    public $enlace;
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT 
                        c.*, 
                        MIN(fc.FechaSalida) AS FechaMasReciente,
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
                    WHERE c.Id = " . intval($id) .
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


            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vSql2 = "SELECT phc.*, h.Tipo AS TipoHabitacion
                                FROM precio_habitacion_crucero phc
                                JOIN habitacion h ON phc.IdHabitacion = h.Id
                                WHERE phc.IdFechasCrucero = " . intval($vResultado[$i]->Id) . ";";
                    $VRes = $this->enlace->ExecuteSQL($vSql2);
                    $vResultado[$i]->precio_habitacion_crucero = $VRes;
                }
            }



            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Crea un crucero con su itinerario, salidas y tarifas en una transacción.
     */
    public function create($objeto)
    {
        $db = $this->enlace;
        $db->beginTransaction();
        try {
            $idCrucero = $db->ejecutar(
                "INSERT INTO crucero (Nombre, Foto, IdBarco) VALUES (?, ?, ?)",
                [trim($objeto->Nombre), $objeto->Foto ?? 'default.jpg', (int) $objeto->IdBarco]
            )['id'];
            $this->guardarItinerario($idCrucero, $objeto->itinerario ?? []);
            foreach (($objeto->fechas ?? []) as $fecha) {
                $this->insertarSalida($idCrucero, $fecha);
            }
            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            handleException($e);
        }
        return $this->get($idCrucero);
    }

    private function guardarItinerario($idCrucero, $itinerario)
    {
        $this->enlace->ejecutar("DELETE FROM itinerario WHERE IdCrucero = ?", [(int) $idCrucero]);
        foreach ($itinerario as $dia) {
            // El formulario de creación envía "Dia" y el de edición "Fecha"
            $numeroDia = (int) ($dia->Dia ?? $dia->Fecha ?? 0);
            $this->enlace->ejecutar(
                "INSERT INTO itinerario (IdCrucero, IdPuerto, Descripcion, Fecha) VALUES (?, ?, ?, ?)",
                [(int) $idCrucero, (int) $dia->IdPuerto, trim($dia->Descripcion ?? ''), $numeroDia]
            );
        }
    }

    private function insertarSalida($idCrucero, $fecha)
    {
        $idFecha = $this->enlace->ejecutar(
            "INSERT INTO fechascrucero (IdCrucero, FechaSalida, FechaLimitePago, CantDias) VALUES (?, ?, ?, ?)",
            [(int) $idCrucero, $fecha->FechaSalida, $fecha->FechaLimitePago, (int) $fecha->CantDias]
        )['id'];
        $this->guardarTarifas($idFecha, $fecha->Precios ?? []);
        return $idFecha;
    }

    private function guardarTarifas($idFecha, $precios)
    {
        $this->enlace->ejecutar("DELETE FROM precio_habitacion_crucero WHERE IdFechasCrucero = ?", [(int) $idFecha]);
        foreach ($precios as $p) {
            $this->enlace->ejecutar(
                "INSERT INTO precio_habitacion_crucero (IdFechasCrucero, IdHabitacion, Precio) VALUES (?, ?, ?)",
                [(int) $idFecha, (int) $p->IdHabitacion, (float) $p->Precio]
            );
        }
    }

    public function getHabitacionesById($id)
    {
        try {
            $vSql = "SELECT h.Id, h.Tipo
                        FROM crucero c
                        JOIN barco b ON c.IdBarco = b.Id
                        JOIN barco_habitacion bh ON bh.IdBarco = b.Id
                        JOIN habitacion h ON h.Id = bh.IdHabitacion
                        WHERE c.Id = " . intval($id) ;
            $vResultado = $this->enlace->ExecuteSQL($vSql);


            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getUpdate($idCrucero)
    {

        try {


            $vSql = "SELECT * from crucero where Id = " . intval($idCrucero);
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            $vResultado = $vResultado[0];

            $vSql = "SELECT * from fechascrucero where IdCrucero = " . intval($idCrucero);
            $fechas = $this->enlace->ExecuteSQL($vSql);

            if (isset($fechas) && is_array($fechas)) {
                foreach ($fechas as $fecha) {
                    $sql = "SELECT * from precio_habitacion_crucero where IdFechasCrucero = $fecha->Id";
                    $precio = $this->enlace->ExecuteSQL($sql);
                    $fecha->Precios = $precio;
                }
            }

            $vSql = "SELECT * from itinerario where IdCrucero = " . intval($idCrucero);
            $itine = $this->enlace->ExecuteSQL($vSql);


            $vResultado->fechas = $fechas;
            $vResultado->itinerario = $itine;

            if (empty($vResultado)) {
                return null; // O lanza una excepción, según tu lógica
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualiza el crucero sin romper las reservas existentes:
     * las salidas se sincronizan por fecha (se actualizan, se agregan o se
     * eliminan), y una salida con reservas no se puede eliminar.
     */
    public function update($objeto)
    {
        $db = $this->enlace;
        $id = (int) $objeto->Id;
        $db->beginTransaction();
        try {
            $campos = "Nombre = ?, IdBarco = ?";
            $valores = [trim($objeto->Nombre), (int) $objeto->IdBarco];
            if (!empty($objeto->Foto)) {
                $campos .= ", Foto = ?";
                $valores[] = $objeto->Foto;
            }
            $valores[] = $id;
            $db->ejecutar("UPDATE crucero SET $campos WHERE Id = ?", $valores);

            $this->guardarItinerario($id, $objeto->itinerario ?? []);

            $existentes = [];
            foreach ($db->consultar("SELECT Id, FechaSalida FROM fechascrucero WHERE IdCrucero = ?", [$id]) as $f) {
                $existentes[$f->FechaSalida] = (int) $f->Id;
            }
            $enviadas = [];
            foreach (($objeto->fechas ?? []) as $fecha) {
                $enviadas[] = $fecha->FechaSalida;
                if (isset($existentes[$fecha->FechaSalida])) {
                    $idFecha = $existentes[$fecha->FechaSalida];
                    $db->ejecutar(
                        "UPDATE fechascrucero SET FechaLimitePago = ?, CantDias = ? WHERE Id = ?",
                        [$fecha->FechaLimitePago, (int) $fecha->CantDias, $idFecha]
                    );
                    $this->guardarTarifas($idFecha, $fecha->Precios ?? []);
                } else {
                    $this->insertarSalida($id, $fecha);
                }
            }
            foreach ($existentes as $fechaSalida => $idFecha) {
                if (in_array($fechaSalida, $enviadas, true)) {
                    continue;
                }
                $conReservas = $db->consultarUno("SELECT COUNT(*) AS n FROM reserva WHERE IdFechaCrucero = ?", [$idFecha]);
                if ($conReservas && (int) $conReservas->n > 0) {
                    throw new Exception("No se puede eliminar la salida del $fechaSalida porque tiene reservas");
                }
                $db->ejecutar("DELETE FROM precio_habitacion_crucero WHERE IdFechasCrucero = ?", [$idFecha]);
                $db->ejecutar("DELETE FROM fechascrucero WHERE Id = ?", [$idFecha]);
            }
            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            Auth::responder(409, $e->getMessage());
        }
        return $this->get($id);
    }

    /**
     * Catálogo público: cada crucero con su barco, próxima salida,
     * precio desde, cantidad de salidas y destinos del itinerario.
     */
    public function catalogo()
    {
        $db = $this->enlace;
        $cruceros = $db->consultar(
            "SELECT c.Id, c.Nombre, c.Foto, c.IdBarco, b.Nombre AS NombreBarco,
                    (SELECT MIN(fc.FechaSalida) FROM fechascrucero fc
                      WHERE fc.IdCrucero = c.Id AND fc.FechaSalida > CURDATE()) AS ProximaSalida,
                    (SELECT COUNT(*) FROM fechascrucero fc
                      WHERE fc.IdCrucero = c.Id AND fc.FechaSalida > CURDATE()) AS Salidas,
                    (SELECT MIN(phc.Precio) FROM precio_habitacion_crucero phc
                       JOIN fechascrucero fc ON fc.Id = phc.IdFechasCrucero
                      WHERE fc.IdCrucero = c.Id AND fc.FechaSalida > CURDATE()) AS PrecioDesde
             FROM crucero c LEFT JOIN barco b ON b.Id = c.IdBarco
             ORDER BY (ProximaSalida IS NULL), ProximaSalida"
        );
        foreach ($cruceros as $c) {
            $c->CantDias = null;
            if ($c->ProximaSalida) {
                $f = $db->consultarUno(
                    "SELECT CantDias FROM fechascrucero WHERE IdCrucero = ? AND FechaSalida = ? LIMIT 1",
                    [(int) $c->Id, $c->ProximaSalida]
                );
                $c->CantDias = $f ? (int) $f->CantDias : null;
            }
            $destinos = $db->consultar(
                "SELECT DISTINCT d.Pais, d.Region FROM itinerario i
                   JOIN puerto p ON p.Id = i.IdPuerto JOIN destino d ON d.Id = p.IdDestino
                  WHERE i.IdCrucero = ? ORDER BY d.Pais",
                [(int) $c->Id]
            );
            $c->Destinos = array_values(array_unique(array_map(fn($d) => $d->Pais, $destinos)));
            $c->Paradas = count($db->consultar("SELECT Id FROM itinerario WHERE IdCrucero = ?", [(int) $c->Id]));
            $c->PrecioDesde = $c->PrecioDesde !== null ? (float) $c->PrecioDesde : null;
        }
        return $cruceros;
    }

    /**
     * Detalle público de un crucero: barco, itinerario ordenado y salidas
     * futuras con la tarifa de cada tipo de camarote.
     */
    public function detalle($id)
    {
        $db = $this->enlace;
        $c = $db->consultarUno(
            "SELECT c.Id, c.Nombre, c.Foto, c.IdBarco, b.Nombre AS NombreBarco,
                    b.Descripcion AS DescripcionBarco, b.Capacidad
             FROM crucero c LEFT JOIN barco b ON b.Id = c.IdBarco WHERE c.Id = ?",
            [(int) $id]
        );
        if (!$c) {
            return null;
        }
        $c->Itinerario = $db->consultar(
            "SELECT i.Id, i.Fecha AS Dia, i.Descripcion, p.Nombre AS Puerto, d.Pais, d.Region
             FROM itinerario i JOIN puerto p ON p.Id = i.IdPuerto JOIN destino d ON d.Id = p.IdDestino
             WHERE i.IdCrucero = ? ORDER BY i.Fecha",
            [(int) $id]
        );
        $c->Salidas = $db->consultar(
            "SELECT Id, FechaSalida, FechaLimitePago, CantDias,
                    DATE_ADD(FechaSalida, INTERVAL CantDias DAY) AS FechaRegreso
             FROM fechascrucero WHERE IdCrucero = ? AND FechaSalida > CURDATE()
             ORDER BY FechaSalida",
            [(int) $id]
        );
        foreach ($c->Salidas as $s) {
            $s->Tarifas = $db->consultar(
                "SELECT h.Id AS IdHabitacion, h.Tipo, h.Descripcion, h.Tamano,
                        h.MinHuespedes, h.MaxHuespedes, phc.Precio
                 FROM precio_habitacion_crucero phc JOIN habitacion h ON h.Id = phc.IdHabitacion
                 WHERE phc.IdFechasCrucero = ? ORDER BY phc.Precio",
                [(int) $s->Id]
            );
        }
        $precios = [];
        foreach ($c->Salidas as $s) {
            foreach ($s->Tarifas as $t) {
                $precios[] = (float) $t->Precio;
            }
        }
        $c->PrecioDesde = $precios ? min($precios) : null;
        return $c;
    }
}
