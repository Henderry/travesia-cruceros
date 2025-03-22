<?php
class Tarjeta
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM tarjeta;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // El parámetro $numero corresponde al campo Numero de la tarjeta
    public function get($numero)
    {
        try {
            $vSql = "SELECT * FROM tarjeta WHERE Numero = " . intval($numero) . ";";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>
