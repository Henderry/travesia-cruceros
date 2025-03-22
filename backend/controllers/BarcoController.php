<?php
//localhost:81/crucero/barco
class barco
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $BarcoM = new BarcoModel;
            //Método del modelo
            $result = $BarcoM->all();
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
            $Barco = new BarcoModel();
            //Acción del modelo a ejecutar
            $result = $Barco->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getListaHabitacionesByBarco($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Barco = new BarcoModel();
            //Acción del modelo a ejecutar
            $result = $Barco->getListaHabitacionesByBarco($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $barcoM = new BarcoModel();
            $result = $barcoM->create($inputJSON);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT Actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            
            $barcoM = new BarcoModel();
            $result = $barcoM->update($inputJSON);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

}
