<?php
class InfoPagoC
{
    /** GET /InfoPagoC — solo administradores */
    public function index()
    {
        Auth::requerirAdmin();
        (new Response())->toJSON((new InfoPagoModel())->all());
    }

    public function get($id)
    {
        Auth::requerirAdmin();
        (new Response())->toJSON((new InfoPagoModel())->get($id), 'Pago no encontrado');
    }

    /**
     * POST /InfoPagoC  { IdReserva }
     * Registra el pago de una reserva del usuario autenticado (o de cualquiera si es admin).
     * La tarjeta se valida en el frontend y no se almacena.
     */
    public function create()
    {
        $usuario = Auth::requerirLogin();
        $datos = (new Request())->getJSON();
        $idReserva = (int) ($datos->IdReserva ?? 0);

        $reserva = (new ReservaModel())->get($idReserva);
        if (!$reserva) {
            Auth::responder(404, 'La reserva no existe');
        }
        if (!Auth::esAdmin() && (int) $reserva->IdUsuario !== $usuario->id) {
            Auth::responder(403, 'No tiene acceso a esta reserva');
        }
        $model = new InfoPagoModel();
        if ($model->yaPagada($idReserva)) {
            Auth::responder(409, 'Esta reserva ya está pagada');
        }
        $model->create($idReserva, $reserva->Total);
        (new Response())->toJSON(['success' => true, 'message' => 'Pago registrado', 'Monto' => $reserva->Total]);
    }
}
