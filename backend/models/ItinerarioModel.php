    <?php
    class Itinerario
    {
        public $enlace;

        public function __construct()
        {
            $this->enlace = new MySqlConnect();
        }
    

        public function all()
        {
            try {
                $vSql = "SELECT * FROM itinerario;";
                $vResultado = $this->enlace->ExecuteSQL($vSql);
                return $vResultado;
            } catch (Exception $e) {
                handleException($e);
            }
        }

        // Obtener un itinerario específico usando IdPuerto y IdCrucero
        public function get($idPuerto, $idCrucero)
        {
            try {
                $vSql = "SELECT * FROM itinerario 
                        WHERE IdPuerto = " . intval($idPuerto) . " 
                        AND IdCrucero = " . intval($idCrucero) . ";";
                $vResultado = $this->enlace->ExecuteSQL($vSql);
                return $vResultado;
            } catch (Exception $e) {
                handleException($e);
            }
        }
    }
    ?>
