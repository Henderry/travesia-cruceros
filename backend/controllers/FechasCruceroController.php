<?php
//localhost:81/crucero/FechasCrucero
class FechasCrucero
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $FechasCruceroM = new FechasCruceroModel;
            //Método del modelo
            $result = $FechasCruceroM->all();
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
            $FechasCrucero = new FechasCruceroModel();
            //Acción del modelo a ejecutar
            $result = $FechasCrucero->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
