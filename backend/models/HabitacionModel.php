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
  
    private function valores($o)
    {
        return [
            trim($o->Descripcion ?? ''),
            (int) ($o->MinHuespedes ?? 1),
            (float) ($o->Tamano ?? 0),
            trim($o->Tipo ?? ''),
            (float) ($o->Precio ?? 0),
            (int) ($o->Disponibilidad ?? 1),
            (int) ($o->MaxHuespedes ?? 1),
        ];
    }

    public function create($objeto)
    {
        $res = $this->enlace->ejecutar(
            "INSERT INTO habitacion (Descripcion, MinHuespedes, Tamano, Tipo, Precio, Disponibilidad, MaxHuespedes)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            $this->valores($objeto)
        );
        return $this->get($res['id']);
    }

    public function update($objeto)
    {
        $this->enlace->ejecutar(
            "UPDATE habitacion SET Descripcion = ?, MinHuespedes = ?, Tamano = ?, Tipo = ?,
                    Precio = ?, Disponibilidad = ?, MaxHuespedes = ?
             WHERE Id = ?",
            array_merge($this->valores($objeto), [(int) $objeto->Id])
        );
        return $this->get($objeto->Id);
    }
 
}
