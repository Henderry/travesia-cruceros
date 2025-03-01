<?php
//localhost:81/crucero/tarjeta
class tarjetaC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $tarjetaM = new TarjetaModel;
            //Método del modelo
            $result = $tarjetaM->all();
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
            $tarjeta = new tarjetaModel();
            //Acción del modelo a ejecutar
            $result = $tarjeta->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
