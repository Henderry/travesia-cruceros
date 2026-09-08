<?php
class InfoPagoModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function all()
    {
        return $this->db->consultar("SELECT * FROM infopago ORDER BY Fecha DESC");
    }

    public function get($id)
    {
        return $this->db->consultarUno("SELECT * FROM infopago WHERE Id = ?", [(int) $id]);
    }

    public function yaPagada($idReserva)
    {
        return (bool) $this->db->consultarUno("SELECT Id FROM infopago WHERE IdReserva = ?", [(int) $idReserva]);
    }

    /** Registra el pago total (subtotal + IVA) de la reserva */
    public function create($idReserva, $monto)
    {
        $this->db->ejecutar(
            "INSERT INTO infopago (IdReserva, Fecha, Monto) VALUES (?, CURDATE(), ?)",
            [(int) $idReserva, (float) $monto]
        );
        return true;
    }
}
