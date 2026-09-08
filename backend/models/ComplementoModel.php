<?php
class ComplementoModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    public function all()
    {
        return $this->db->consultar(
            "SELECT c.Id, c.Descripcion, c.Precio, c.PrecioAplicado,
                    (SELECT COALESCE(SUM(Cantidad), 0) FROM reserva_complemento WHERE IdComplemento = c.Id) AS Vendidos
             FROM complemento c ORDER BY c.Descripcion"
        );
    }

    public function get($id)
    {
        return $this->db->consultarUno("SELECT * FROM complemento WHERE Id = ?", [(int) $id]);
    }

    public function create($d)
    {
        $res = $this->db->ejecutar(
            "INSERT INTO complemento (Descripcion, Precio, PrecioAplicado) VALUES (?, ?, ?)",
            [trim($d->Descripcion), (float) $d->Precio, (float) $d->PrecioAplicado]
        );
        return $this->get($res['id']);
    }

    public function update($d)
    {
        $this->db->ejecutar(
            "UPDATE complemento SET Descripcion = ?, Precio = ?, PrecioAplicado = ? WHERE Id = ?",
            [trim($d->Descripcion), (float) $d->Precio, (float) $d->PrecioAplicado, (int) $d->Id]
        );
        return $this->get($d->Id);
    }

    public function delete($id)
    {
        $usado = $this->db->consultarUno("SELECT 1 AS usado FROM reserva_complemento WHERE IdComplemento = ? LIMIT 1", [(int) $id]);
        if ($usado) {
            Auth::responder(409, 'No se puede eliminar: el complemento ya forma parte de reservas');
        }
        $this->db->ejecutar("DELETE FROM complemento WHERE Id = ?", [(int) $id]);
        return ['success' => true];
    }
}
