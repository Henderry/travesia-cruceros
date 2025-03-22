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
    public function create($objeto)
    {
        try {
            // 1. Insertar crucero (usando parámetros seguros)
            $vSql = "INSERT INTO crucero (Nombre, Foto, IdBarco) 
                     VALUES (
                       " . $this->enlace->executeSQL("SELECT QUOTE('$objeto->Nombre') AS result")[0]->result . ",
                       " . $this->enlace->executeSQL("SELECT QUOTE('$objeto->Foto') AS result")[0]->result . ",
                       " . intval($objeto->IdBarco) . "
                     )";
            $idCrucero = $this->enlace->executeSQL_DML_last($vSql);

            // 2. Insertar itinerario
            foreach ($objeto->itinerario as $dia) {
                // Se asegura de escapar la descripción
                $descripcionSegura = $this->enlace->executeSQL("SELECT QUOTE('$dia->Descripcion') AS result")[0]->result;
                // Se espera que $dia->Dia venga en el payload
                $vSql = "INSERT INTO itinerario 
                         (IdCrucero, IdPuerto, Descripcion, Fecha) 
                         VALUES (
                            $idCrucero,
                            " . intval($dia->IdPuerto) . ",
                            $descripcionSegura,
                            " . intval($dia->Dia) . "
                         )";
                $this->enlace->executeSQL_DML($vSql);
            }

            // 3. Insertar fechas y precios
            foreach ($objeto->fechas as $fecha) {
                // Insertar la fecha del crucero
                $vSql = "INSERT INTO fechascrucero 
                         (IdCrucero, FechaSalida, FechaLimitePago, CantDias) 
                         VALUES (
                            $idCrucero,
                            '" . $fecha->FechaSalida . "',
                            '" . $fecha->FechaLimitePago . "',
                            " . intval($fecha->CantDias) . "
                         )";
                $fechaId = $this->enlace->executeSQL_DML_last($vSql);

                // Insertar precios para esta fecha
                foreach ($fecha->Precios as $Precio) {
                    $vSql = "INSERT INTO precio_habitacion_crucero 
                             (IdFechasCrucero, IdHabitacion, Precio) 
                             VALUES (
                               $fechaId,
                               " . intval($Precio->IdHabitacion) . ",
                               " . floatval($Precio->Precio) . "
                             )";
                    $this->enlace->executeSQL_DML($vSql);
                }
            }

            // Devuelve el objeto insertado (consulta por id)
            return $this->get($idCrucero);
        } catch (Exception $e) {
            handleException($e);
            return null;
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
    public function update($objeto)
{
    try {
        // 1. Escapar valores sensibles usando QUOTE()
        $nombreSeguro = $this->enlace->executeSQL("SELECT QUOTE('$objeto->Nombre') AS result")[0]->result;

        // 2. Construir la consulta de actualización base
        $updateFields = "Nombre = $nombreSeguro, IdBarco = " . intval($objeto->IdBarco);

        // Solo actualizar Foto si se proporciona un valor no vacío
        if (isset($objeto->Foto) && !empty($objeto->Foto)) {
            $fotoSegura = $this->enlace->executeSQL("SELECT QUOTE('$objeto->Foto') AS result")[0]->result;
            $updateFields .= ", Foto = $fotoSegura";
        }

        // 3. Ejecutar la actualización en la tabla crucero
        $vSql = "UPDATE crucero SET $updateFields WHERE Id = " . intval($objeto->Id);
        $this->enlace->executeSQL_DML($vSql);

        // 4. Actualizar itinerario: eliminar existente y reinsertar
        $this->enlace->executeSQL_DML("DELETE FROM itinerario WHERE IdCrucero = " . intval($objeto->Id));
        foreach ($objeto->itinerario as $dia) {
            $descripcionSegura = $this->enlace->executeSQL("SELECT QUOTE('$dia->Descripcion') AS result")[0]->result;
            $vSql = "INSERT INTO itinerario 
                     (IdCrucero, IdPuerto, Descripcion, Fecha) 
                     VALUES (
                        " . intval($objeto->Id) . ",
                        " . intval($dia->IdPuerto) . ",
                        $descripcionSegura,
                        " . intval($dia->Fecha) . "
                     )";
            $this->enlace->executeSQL_DML($vSql);
        }

        // 5. Actualizar fechas y precios: eliminar existente y reinsertar
        $this->enlace->executeSQL_DML("DELETE FROM fechascrucero WHERE IdCrucero = " . intval($objeto->Id));
        foreach ($objeto->fechas as $fecha) {
            $vSql = "INSERT INTO fechascrucero 
                     (IdCrucero, FechaSalida, FechaLimitePago, CantDias) 
                     VALUES (
                        " . intval($objeto->Id) . ",
                        '" . $fecha->FechaSalida . "',
                        '" . $fecha->FechaLimitePago . "',
                        " . intval($fecha->CantDias) . "
                     )";
            $fechaId = $this->enlace->executeSQL_DML_last($vSql);

            foreach ($fecha->Precios as $precio) {
                $vSql = "INSERT INTO precio_habitacion_crucero 
                         (IdFechasCrucero, IdHabitacion, Precio) 
                         VALUES (
                            " . intval($fechaId) . ",
                            " . intval($precio->IdHabitacion) . ",
                            " . floatval($precio->Precio) . "
                         )";
                $this->enlace->executeSQL_DML($vSql);
            }
        }

        // Retornar el registro actualizado
        return $this->get($objeto->Id);
    } catch (Exception $e) {
        handleException($e);
        return null;
    }
}

   



    
}
