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
    public function create()
    {
        try {
            $response = new Response();
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validar ID reserva
            if(!isset($data['IdReserva']) || empty($data['IdReserva'])) {
                throw new Exception("ID de reserva requerido");
            }

            $model = new InfoPagoModel();
            $result = $model->create($data['IdReserva']);
            
            $response->toJSON(["success" => true, "message" => "Pago registrado"]);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }
 

}
