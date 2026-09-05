<?php
class RoutesController
{
    /**
     * Permisos por controlador.
     * - Lectura (GET) del catálogo: pública.
     * - Escritura del catálogo (POST/PUT/DELETE): solo administradores.
     * - Reservas y pagos: requieren sesión; el controlador valida que cada
     *   cliente solo vea y modifique lo suyo.
     */
    private function autorizar($metodo, $controlador, $accion)
    {
        $controlador = strtolower((string) $controlador);
        $accion = strtolower((string) $accion);

        $publicas = ['usuarioc' => ['login', 'registrar']];
        if (isset($publicas[$controlador]) && in_array($accion, $publicas[$controlador], true)) {
            return;
        }
        if ($controlador === 'usuarioc' && $accion === 'perfil') {
            Auth::requerirLogin();
            return;
        }
        if (in_array($controlador, ['reserva', 'infopagoc'], true)) {
            Auth::requerirLogin();
            return;
        }
        $soloAdmin = ['reportec', 'usuarioc', 'huespedc', 'rolesusuarioc',
                      'reserva_habitacionc', 'reserva_complementoc'];
        if (in_array($controlador, $soloAdmin, true)) {
            Auth::requerirAdmin();
            return;
        }
        if ($metodo !== 'GET') {
            Auth::requerirAdmin();
        }
    }

    /**
     * Segmentos de la URL sin la carpeta del API:
     * [1 => base, 2 => controlador, 3 => acción, 4 => param1, 5 => param2].
     */
    private function segmentosDeRuta()
    {
        $ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
        $base = $_SERVER['API_BASE']
            ?? rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');

        if ($base !== '' && stripos($ruta . '/', $base . '/') === 0) {
            $ruta = substr($ruta, strlen($base));
        }

        $segmentos = [1 => $base !== '' ? $base : 'api'];
        foreach (explode('/', $ruta) as $segmento) {
            if ($segmento !== '') {
                $segmentos[] = urldecode($segmento);
            }
        }
        return $segmentos;
    }

    public function index()
    {
        //include "routes/routes.php";
        if (isset($_SERVER['REQUEST_URI']) && !empty($_SERVER['REQUEST_URI'])) {
            //Gestion de imagenes
            if (strpos($_SERVER['REQUEST_URI'], '/uploads/') === 0) {
                $filePath = __DIR__ . $_SERVER['REQUEST_URI'];
                
                // Verificar si el archivo existe
                if (file_exists($filePath)) {
                    header('Content-Type: ' . mime_content_type($filePath));
                    readfile($filePath);
                    exit;
                } else {
                    http_response_code(404);
                    echo 'Archivo no encontrado.';
                }
            }
             //FIN Gestion de imagenes
             //Solicitud preflight
             if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
                // Terminar la solicitud de preflight
                http_response_code(200);
                exit();
            }
            $routesArray = $this->segmentosDeRuta();

            if (count($routesArray) < 2) {
                $json = array(
                    'status' => 404,
                    'result' => 'Controlador no especificado'
                );
                echo json_encode($json, http_response_code($json["status"]));
                return;
            }

            if (isset($_SERVER['REQUEST_METHOD'])) {
                $controller = $routesArray[2] ?? null;
                $action = $routesArray[3] ?? null;
                $param1 = $routesArray[4] ?? null;
                $param2 = $routesArray[5] ?? null;
                if ($controller) {
                    try {
                        if (class_exists($controller)) {
                            $this->autorizar($_SERVER['REQUEST_METHOD'], $controller, $action);
                            $response = new $controller();
                            switch ($_SERVER['REQUEST_METHOD']) {
                                case 'GET':
                                    if ($param1 && $param2) {
                                        $response->$action($param1, $param2);
                                    } elseif ($param1 && !isset($action)) {
                                        $response->get($param1);
                                    } elseif ($param1 && isset($action)) {
                                        $response->$action($param1);
                                    } elseif (!isset($action)) {
                                        $response->index();
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } elseif (count($routesArray) == 3) {
                                            $response->get($action);
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        // Llamar a la acción index si no hay acción ni parámetro
                                        $response->index();
                                    }
                                    break;

                                case 'POST':
                                    if ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->create();
                                    }
                                    break;

                                case 'PUT':
                                case 'PATCH':
                                    if ($param1) {
                                        $response->update($param1);
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->update();
                                    }
                                    break;

                                case 'DELETE':
                                    if ($param1) {
                                        $response->delete($param1);
                                    } elseif ($action) {
                                        if (method_exists($controller, $action)) {
                                            $response->$action();
                                        } else {
                                            $json = array(
                                                'status' => 404,
                                                'result' => 'Acción no encontrada'
                                            );
                                            echo json_encode($json, http_response_code($json["status"]));
                                        }
                                    } else {
                                        $response->delete();
                                    }
                                    break;

                                default:
                                    $json = array(
                                        'status' => 405,
                                        'result' => 'Método HTTP no permitido'
                                    );
                                    echo json_encode($json, http_response_code($json["status"]));
                                    break;
                            }
                        } else {
                            $json = array(
                                'status' => 404,
                                'result' => 'Controlador no encontrado'
                            );
                            echo json_encode($json, http_response_code($json["status"]));
                        }
                    } catch (\Throwable $th) {
                        $json = array(
                            'status' => 404,
                            'result' => $th->getMessage()
                        );
                        echo json_encode($json, http_response_code($json["status"]));
                    }
                } else {
                    $json = array(
                        'status' => 404,
                        'result' => 'Controlador o acción no especificados'
                    );
                    echo json_encode($json, http_response_code($json["status"]));
                }
            }
        }
    }
}
