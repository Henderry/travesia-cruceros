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
                            b.HabitacionesDispoinbles AS HabitacionesDispoinbles
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
            try {
                // Insertar el barco sin HabitacionesDisponibles
                $sql = "INSERT INTO barco (Nombre, Descripcion, Capacidad) 
                        VALUES ('$objeto->Nombre', '$objeto->Descripcion', $objeto->Capacidad)";
                
                $idBarco = $this->enlace->executeSQL_DML_last($sql);
        
                // Insertar las habitaciones en la tabla barco_habitacion
                if (isset($objeto->habitaciones) && is_array($objeto->habitaciones)) {
                    foreach ($objeto->habitaciones as $habitacion) {
                        $sqlHabitacion = "INSERT INTO barco_habitacion (IdBarco, IdHabitacion, CantDisponible) 
                                          VALUES ($idBarco, {$habitacion->IdHabitacion}, {$habitacion->CantDisponible})";
                        $this->enlace->executeSQL_DML($sqlHabitacion);
                    }
                }
        
                return $this->get($idBarco);
        
            } catch (Exception $e) {
                handleException($e);
            }
        }

    public function update($objeto)
    {
        try {
            $sql = "UPDATE barco SET 
                    Nombre = '$objeto->Nombre',
                    Descripcion = '$objeto->Descripcion',
                    Capacidad = $objeto->Capacidad,
                    HabitacionesDispoinbles = $objeto->HabitacionesDispoinbles
                    WHERE Id = $objeto->Id";

            $this->enlace->executeSQL_DML($sql);

            if (isset($objeto->habitaciones) && is_array($objeto->habitaciones)) {
                $vSql="DELETE from barco_habitacion where IdBarco = $objeto->Id";
                $this->enlace->executeSQL_DML($vSql);
                foreach ($objeto->habitaciones as $habitacion) {
                    $sqlHabitacion = "INSERT INTO barco_habitacion (IdBarco, IdHabitacion, CantDisponible) 
                                      VALUES ($objeto->Id, {$habitacion->IdHabitacion}, {$habitacion->CantDisponible})";
                    $this->enlace->executeSQL_DML($sqlHabitacion);
                }
            }



            return $this->get($objeto->Id);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    }
    ?>
