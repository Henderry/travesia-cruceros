<?php
class usuarioC
{
    /** GET /usuarioC — listado para el panel de administración */
    public function index()
    {
        $model = new UsuarioModel();
        (new Response())->toJSON($model->all());
    }

    /** GET /usuarioC/{id} */
    public function get($id)
    {
        $model = new UsuarioModel();
        (new Response())->toJSON($model->get($id), 'Usuario no encontrado');
    }

    /** POST /usuarioC/login  { Correo, Contrasena } */
    public function login()
    {
        $datos = (new Request())->getJSON();
        if (empty($datos->Correo) || empty($datos->Contrasena)) {
            Auth::responder(422, 'Ingrese su correo y contraseña');
        }
        $usuario = (new UsuarioModel())->login($datos->Correo, $datos->Contrasena);
        if (!$usuario) {
            Auth::responder(401, 'Correo o contraseña incorrectos');
        }
        (new Response())->toJSON([
            'token' => Auth::generarToken($usuario),
            'usuario' => $usuario,
        ]);
    }

    /** POST /usuarioC/registrar  { Nombre, Correo, Contrasena, Telefono?, Pais?, FechaNacimiento? } */
    public function registrar()
    {
        $datos = (new Request())->getJSON();
        $nombre = trim($datos->Nombre ?? '');
        $correo = trim($datos->Correo ?? '');
        $contrasena = $datos->Contrasena ?? '';

        if (mb_strlen($nombre) < 3) {
            Auth::responder(422, 'Ingrese su nombre completo');
        }
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            Auth::responder(422, 'El correo no es válido');
        }
        if (strlen($contrasena) < 8 || !preg_match('/[A-Za-z]/', $contrasena) || !preg_match('/\d/', $contrasena)) {
            Auth::responder(422, 'La contraseña debe tener al menos 8 caracteres, con letras y números');
        }
        $model = new UsuarioModel();
        if ($model->existeCorreo($correo)) {
            Auth::responder(409, 'Ya existe una cuenta con ese correo');
        }
        $usuario = $model->registrar($datos);
        http_response_code(201);
        echo json_encode([
            'token' => Auth::generarToken($usuario),
            'usuario' => $usuario,
        ], JSON_UNESCAPED_UNICODE);
    }

    /** GET /usuarioC/perfil — datos del usuario autenticado */
    public function perfil()
    {
        $actual = Auth::requerirLogin();
        (new Response())->toJSON((new UsuarioModel())->get($actual->id), 'Usuario no encontrado');
    }
}
