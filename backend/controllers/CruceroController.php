<?php
class Crucero
{
    // GET Listar todos los cruceros
    public function index()
    {
        try {
            $response = new Response();
            $model = new CruceroModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getUpdate($id)
    {
        try {
            $response = new Response();
            $model = new CruceroModel();

            // Obtener datos básicos
            $crucero = $model->getUpdate($id);
            $response->toJSON($crucero);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getHabitacionesById($id)
    {
        try {
            $response = new Response();
            $model = new CruceroModel();
            $result = $model->getHabitacionesById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET Obtener un crucero específico
    public function get($id)
    {
        try {
            $response = new Response();
            $model = new CruceroModel();

            // Obtener datos básicos
            $crucero = $model->get($id);

            // Obtener itinerario
            $crucero->itinerario = $model->getItinerarioById($id);

            // Obtener fechas con precios
            $crucero->fechas = $model->getFechasCruceroById($id);

            $response->toJSON($crucero);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET Obtener itinerario de un crucero
    public function getItinerarioById($id)
    {
        try {
            $response = new Response();
            $model = new CruceroModel();
            $result = $model->getItinerarioById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET Obtener fechas de un crucero
    public function getFechasCruceroById($id)
    {
        try {
            $response = new Response();
            $model = new CruceroModel();
            $result = $model->getFechasCruceroById($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST Crear nuevo crucero
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener datos del body
            $inputJSON = $request->getJSON();

            $model = new CruceroModel();
            $result = $model->create($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT Actualizar crucero
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener datos del body
            $inputJSON = $request->getJSON();

            $model = new CruceroModel();
            $result = $model->update($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /** GET /Crucero/catalogo — listado público enriquecido */
    public function catalogo()
    {
        (new Response())->toJSON((new CruceroModel())->catalogo());
    }

    /** GET /Crucero/detalle/{id} */
    public function detalle($id)
    {
        (new Response())->toJSON((new CruceroModel())->detalle($id), 'Crucero no encontrado');
    }
}
