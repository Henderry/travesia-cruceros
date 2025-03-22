<?php
//localhost:81/crucero/habitacion
class habitacion
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $habitacionM = new HabitacionModel;
            //Método del modelo
            $result = $habitacionM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //GET Obtener 
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $habitacion = new HabitacionModel();
            //Acción del modelo a ejecutar
            $result = $habitacion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create() {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $habitacionM = new HabitacionModel();
            $result = $habitacionM->create($inputJSON);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
 
    // PUT Actualizar
    public function update() {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $habitacionM = new HabitacionModel();
            $result = $habitacionM->update($inputJSON);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
//GET /crucero/habitacion/tipos
public function tipos()
{
    try {
        $response = new Response();
        $habitacionM = new HabitacionModel();
        // Obtener el listado de tipos (DISTINCT Tipo)
        $result = $habitacionM->getTiposHabitacion();
        // Retornar en JSON
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}

}
