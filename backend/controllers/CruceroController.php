<?php
//localhost:81/crucero/Crucero
class Crucero
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $CruceroM = new CruceroModel;
            //Método del modelo
            $result = $CruceroM->all();
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
            $Crucero = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $Crucero->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getItinerarioById($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Crucero = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $Crucero->getItinerarioById($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getFechasCruceroById($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Crucero = new CruceroModel();
            //Acción del modelo a ejecutar
            $result = $Crucero->getFechasCruceroById($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
