<?php
//localhost:81/crucero/Reserva_Complemento
class Reserva_ComplementoC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $Reserva_ComplementoM = new Reserva_ComplementoModel;
            //Método del modelo
            $result = $Reserva_ComplementoM->all();
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
            $Reserva_Complemento = new Reserva_ComplementoModel();
            //Acción del modelo a ejecutar
            $result = $Reserva_Complemento->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
