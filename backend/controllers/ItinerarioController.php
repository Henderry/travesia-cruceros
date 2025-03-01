<?php
//localhost:81/crucero/itinerario
class itinerarioC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $itinerarioM = new ItinerarioModel;
            //Método del modelo
            $result = $itinerarioM->all();
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
            $itinerario = new itinerarioModel();
            //Acción del modelo a ejecutar
            $result = $itinerario->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
