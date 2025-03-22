<?php
//localhost:81/crucero/Barco_Habitacion
class Barco_HabitacionC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $Barco_HabitacionM = new Barco_HabitacionModel;
            //Método del modelo
            $result = $Barco_HabitacionM->all();
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
            $Barco_Habitacion = new Barco_HabitacionModel();
            //Acción del modelo a ejecutar
            $result = $Barco_Habitacion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
