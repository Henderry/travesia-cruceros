<?php
class HabitacionModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {
            $vSql = "SELECT * FROM habitacion;";
            $vResultado = $this->enlace->ExecuteSQL ( $vSql);
            
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getTiposHabitacion() {
        try {
            $vSql = "SELECT DISTINCT Tipo FROM habitacion;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado; // Devuelve un array de filas, cada una con 'Tipo'
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM habitacion where Id = $id";
            $vResultado = $this->enlace->ExecuteSQL ( $vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
  
    public function create($objeto) {
        try {
            $sql = "INSERT INTO habitacion (Descripcion, MinHusoedes, Tamano, Tipo, Precio, Disponibilidad, MaxHuespedes) 
                    VALUES ('$objeto->Descripcion', $objeto->MinHusoedes, $objeto->Tamano, '$objeto->Tipo', $objeto->Precio, $objeto->Disponibilidad, $objeto->MaxHuespedes)";
            
            $idHabitacion = $this->enlace->executeSQL_DML_last($sql);
            return $this->get($idHabitacion);

        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update($objeto) {
        try {
            $sql = "UPDATE habitacion SET 
                    Descripcion = '$objeto->Descripcion',
                    MinHusoedes = $objeto->MinHusoedes,
                    Tamano = $objeto->Tamano,
                    Tipo = '$objeto->Tipo',
                    Precio = $objeto->Precio,
                    Disponibilidad = $objeto->Disponibilidad,
                    MaxHuespedes = $objeto->MaxHuespedes
                    WHERE Id = $objeto->Id";

            $this->enlace->executeSQL_DML($sql);
            return $this->get($objeto->Id);

        } catch (Exception $e) {
            handleException($e);
        }
    }
 
}
