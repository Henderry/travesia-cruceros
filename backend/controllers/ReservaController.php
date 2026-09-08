<?php
class Reserva
{
    /** GET /Reserva — el administrador ve todas; el cliente solo las suyas */
    public function index()
    {
        $usuario = Auth::requerirLogin();
        $model = new ReservaModel();
        $filtro = Auth::esAdmin() ? null : $usuario->id;
        (new Response())->toJSON($model->all($filtro));
    }

    /** GET /Reserva/{id} */
    public function get($id)
    {
        $usuario = Auth::requerirLogin();
        $reserva = (new ReservaModel())->get($id);
        if (!$reserva) {
            Auth::responder(404, 'La reserva no existe');
        }
        if (!Auth::esAdmin() && (int) $reserva->IdUsuario !== $usuario->id) {
            Auth::responder(403, 'No tiene acceso a esta reserva');
        }
        (new Response())->toJSON($reserva);
    }

    /** POST /Reserva — la reserva queda a nombre del usuario autenticado */
    public function create()
    {
        $usuario = Auth::requerirLogin();
        $datos = (new Request())->getJSON();
        if (!$datos) {
            Auth::responder(422, 'Datos de la reserva inválidos');
        }
        $reserva = (new ReservaModel())->create($usuario->id, $datos);
        http_response_code(201);
        echo json_encode($reserva, JSON_UNESCAPED_UNICODE);
    }
}
