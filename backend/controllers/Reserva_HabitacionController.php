<?php
//localhost:81/crucero/Reserva_Habitacion
class Reserva_HabitacionC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $Reserva_HabitacionM = new Reserva_HabitacionModel;
            //Método del modelo
            $result = $Reserva_HabitacionM->all();
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
            $Reserva_Habitacion = new Reserva_HabitacionModel();
            //Acción del modelo a ejecutar
            $result = $Reserva_Habitacion->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
