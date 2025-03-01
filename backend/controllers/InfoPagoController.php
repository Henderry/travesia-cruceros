<?php
//localhost:81/crucero/InfoPago
class InfoPagoC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $InfoPagoM = new InfoPagoModel;
            //Método del modelo
            $result = $InfoPagoM->all();
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
            $InfoPago = new InfoPagoModel();
            //Acción del modelo a ejecutar
            $result = $InfoPago->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
