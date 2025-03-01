<?php
//localhost:81/crucero/RolesUsuario
class RolesUsuarioC
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $RolesUsuarioM = new RolesUsuarioModel;
            //Método del modelo
            $result = $RolesUsuarioM->all();
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
            $RolesUsuario = new RolesUsuarioModel();
            //Acción del modelo a ejecutar
            $result = $RolesUsuario->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
 

}
