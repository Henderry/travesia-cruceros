<?php
//localhost:81/crucero/Destino
class DestinoC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $DestinoM = new DestinoModel;
            //Método del modelo
            $result = $DestinoM->all();
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
            $Destino = new DestinoModel();
            //Acción del modelo a ejecutar
            $result = $Destino->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
