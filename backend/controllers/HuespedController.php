<?php
//localhost:81/crucero/huesped
class huespedC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $huespedM = new HuespedModel;
            //Método del modelo
            $result = $huespedM->all();
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
            $huesped = new huespedModel();
            //Acción del modelo a ejecutar
            $result = $huesped->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
