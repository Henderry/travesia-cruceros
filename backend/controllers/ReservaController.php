<?php
//localhost:81/crucero/Reserva
class Reserva
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $ReservaM = new ReservaModel;
            //Método del modelo
            $result = $ReservaM->all();
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
            $Reserva = new ReservaModel();
            //Acción del modelo a ejecutar
            $result = $Reserva->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
