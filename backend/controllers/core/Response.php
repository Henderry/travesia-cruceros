<?php

class Response
{
    private $status = 200;

    public function status(int $code)
    {
        $this->status = $code;
        return $this;
    }
    
    public function toJSON($response = [], $message = "")
    {
        // Un arreglo vacío es válido; solo null/false es "no encontrado".
        if ($response === null || $response === false) {
            $this->status = 404;
            $json = ['status' => 404, 'message' => $message ?: 'Recurso no encontrado'];
        } else {
            $json = $response;
        }
        http_response_code($this->status);
        echo json_encode($json, JSON_UNESCAPED_UNICODE);
    }
}
