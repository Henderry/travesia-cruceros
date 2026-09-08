<?php
class ComplementoC
{
    public function index()
    {
        (new Response())->toJSON((new ComplementoModel())->all());
    }

    public function get($id)
    {
        (new Response())->toJSON((new ComplementoModel())->get($id), 'Complemento no encontrado');
    }

    public function create()
    {
        $d = $this->validar((new Request())->getJSON());
        http_response_code(201);
        echo json_encode((new ComplementoModel())->create($d), JSON_UNESCAPED_UNICODE);
    }

    public function update($id = null)
    {
        $d = $this->validar((new Request())->getJSON());
        if ($id) {
            $d->Id = (int) $id;
        }
        if (empty($d->Id)) {
            Auth::responder(422, 'Falta el identificador del complemento');
        }
        (new Response())->toJSON((new ComplementoModel())->update($d));
    }

    public function delete($id = null)
    {
        (new Response())->toJSON((new ComplementoModel())->delete($id));
    }

    private function validar($d)
    {
        if (!$d || mb_strlen(trim($d->Descripcion ?? '')) < 3) {
            Auth::responder(422, 'La descripción es obligatoria');
        }
        if (!is_numeric($d->Precio ?? null) || !is_numeric($d->PrecioAplicado ?? null)
            || $d->Precio < 0 || $d->PrecioAplicado < 0) {
            Auth::responder(422, 'Los precios deben ser números positivos');
        }
        if ($d->PrecioAplicado > $d->Precio) {
            Auth::responder(422, 'El precio aplicado no puede ser mayor que el precio regular');
        }
        return $d;
    }
}
