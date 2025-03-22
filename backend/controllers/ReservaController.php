<?php
class Reserva
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new ReservaModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new ReservaModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $model = new ReservaModel();
            $result = $model->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}