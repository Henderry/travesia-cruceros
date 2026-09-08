<?php
    class BarcoModel
    {
        public $enlace;

        public function __construct()
        {
            $this->enlace = new MySqlConnect();
        }

        /* Listado de barcos con cantidad total de habitaciones */
        public function all()
        {
            try {
                $vSql = "SELECT 
                            b.Id,
                            b.Nombre as nombre,
                            b.Descripcion as descripcion,
                            b.Capacidad as capacidad,
                            COALESCE(SUM(bh.CantDisponible), 0) as total_habitaciones
                        FROM barco b
                        LEFT JOIN barco_habitacion bh ON b.Id = bh.IdBarco
                        GROUP BY b.Id, b.Nombre, b.Descripcion, b.Capacidad;";

                $vResultado = $this->enlace->ExecuteSQL($vSql);
                return $vResultado;
            } catch (Exception $e) {
                handleException($e);
            }
        }

        /* Detalle de barco sin habitaciones */
        public function get($id)
        {
            try {
                // Consulta para obtener únicamente los detalles del barco
                $vSql = "SELECT 
                            b.Id,
                            b.Nombre,
                            b.Descripcion,
                            b.Capacidad,
                            b.HabitacionesDisponibles AS HabitacionesDisponibles
                        FROM barco b
                        WHERE b.Id = " . intval($id);

                $barcoResult = $this->enlace->ExecuteSQL($vSql); // Ejecuta la consulta
                $barcoResult=$barcoResult[0];

                $vSql="SELECT 
                            IdHabitacion,
                            CantDisponible
                            from barco_habitacion
                            where IdBarco=". intval($id);

                $habitacionesBarco = $this->enlace->ExecuteSQL($vSql);
                $barcoResult->habitaciones=$habitacionesBarco;


                // Verifica si se obtuvo algún resultado
                if (empty($barcoResult)) {
                    return null; // O lanza una excepción, según tu lógica
                }

                // Asigna el primer registro a $barco
                

                return $barcoResult;
            } catch (Exception $e) {
                handleException($e);
            }
        }


        public function getListaHabitacionesByBarco($id)
        {
            try {
                $vSql = "SELECT 
                            h.Id,
                            h.Tipo,
                            bh.CantDisponible
                            
                                FROM barco_habitacion bh
                                JOIN habitacion h ON bh.IdHabitacion = h.Id
                                WHERE bh.IdBarco = ". intval($id);

                $vResultado = $this->enlace->ExecuteSQL($vSql);
                return $vResultado;
            } catch (Exception $e) {
                handleException($e);
            }
        }

        public function create($objeto)
        {
            $this->enlace->beginTransaction();
            try {
                $idBarco = $this->enlace->ejecutar(
                    "INSERT INTO barco (Nombre, Descripcion, Capacidad) VALUES (?, ?, ?)",
                    [trim($objeto->Nombre), trim($objeto->Descripcion ?? ''), (int) $objeto->Capacidad]
                )['id'];
                $this->guardarHabitaciones($idBarco, $objeto->habitaciones ?? []);
                $this->enlace->commit();
            } catch (Exception $e) {
                $this->enlace->rollback();
                handleException($e);
            }
            return $this->get($idBarco);
        }

        private function guardarHabitaciones($idBarco, $habitaciones)
        {
            $this->enlace->ejecutar("DELETE FROM barco_habitacion WHERE IdBarco = ?", [(int) $idBarco]);
            foreach ($habitaciones as $h) {
                $this->enlace->ejecutar(
                    "INSERT INTO barco_habitacion (IdBarco, IdHabitacion, CantDisponible) VALUES (?, ?, ?)",
                    [(int) $idBarco, (int) $h->IdHabitacion, (int) $h->CantDisponible]
                );
            }
            $this->enlace->ejecutar(
                "UPDATE barco SET HabitacionesDisponibles =
                    (SELECT COALESCE(SUM(CantDisponible), 0) FROM barco_habitacion WHERE IdBarco = ?)
                 WHERE Id = ?",
                [(int) $idBarco, (int) $idBarco]
            );
        }

    public function update($objeto)
    {
        $this->enlace->beginTransaction();
        try {
            $this->enlace->ejecutar(
                "UPDATE barco SET Nombre = ?, Descripcion = ?, Capacidad = ? WHERE Id = ?",
                [trim($objeto->Nombre), trim($objeto->Descripcion ?? ''), (int) $objeto->Capacidad, (int) $objeto->Id]
            );
            if (isset($objeto->habitaciones) && is_array($objeto->habitaciones)) {
                $this->guardarHabitaciones($objeto->Id, $objeto->habitaciones);
            }
            $this->enlace->commit();
        } catch (Exception $e) {
            $this->enlace->rollback();
            handleException($e);
        }
        return $this->get($objeto->Id);
    }

    /** Listado público con total de camarotes y cruceros asignados */
    public function catalogo()
    {
        $barcos = $this->enlace->consultar(
            "SELECT b.Id, b.Nombre, b.Descripcion, b.Capacidad,
                    COALESCE(SUM(bh.CantDisponible), 0) AS Camarotes,
                    (SELECT COUNT(*) FROM crucero c WHERE c.IdBarco = b.Id) AS Cruceros,
                    (SELECT c.Foto FROM crucero c WHERE c.IdBarco = b.Id ORDER BY c.Id LIMIT 1) AS Foto
             FROM barco b LEFT JOIN barco_habitacion bh ON bh.IdBarco = b.Id
             GROUP BY b.Id, b.Nombre, b.Descripcion, b.Capacidad
             ORDER BY b.Nombre"
        );
        return $barcos;
    }

    /** Detalle público: camarotes por tipo y cruceros que opera */
    public function detalle($id)
    {
        $b = $this->enlace->consultarUno(
            "SELECT Id, Nombre, Descripcion, Capacidad, HabitacionesDisponibles FROM barco WHERE Id = ?",
            [(int) $id]
        );
        if (!$b) {
            return null;
        }
        $b->Habitaciones = $this->enlace->consultar(
            "SELECT h.Id, h.Tipo, h.Descripcion, h.Tamano, h.MinHuespedes, h.MaxHuespedes,
                    h.Precio, bh.CantDisponible
             FROM barco_habitacion bh JOIN habitacion h ON h.Id = bh.IdHabitacion
             WHERE bh.IdBarco = ? ORDER BY h.Precio",
            [(int) $id]
        );
        $b->Cruceros = $this->enlace->consultar(
            "SELECT c.Id, c.Nombre, c.Foto,
                    (SELECT MIN(FechaSalida) FROM fechascrucero f
                      WHERE f.IdCrucero = c.Id AND f.FechaSalida > CURDATE()) AS ProximaSalida
             FROM crucero c WHERE c.IdBarco = ? ORDER BY c.Nombre",
            [(int) $id]
        );
        $b->Foto = $b->Cruceros ? $b->Cruceros[0]->Foto : null;
        return $b;
    }
}
