<?php
//localhost:81/crucero/Complemento
class ComplementoC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $ComplementoM = new ComplementoModel;
            //Método del modelo
            $result = $ComplementoM->all();
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
            $Complemento = new ComplementoModel();
            //Acción del modelo a ejecutar
            $result = $Complemento->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
