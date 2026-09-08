<?php
class ReporteC
{
    /** GET /ReporteC/resumen — solo administradores (ver RoutesController) */
    public function resumen()
    {
        Auth::requerirAdmin();
        (new Response())->toJSON((new ReporteModel())->resumen());
    }

    public function index()
    {
        $this->resumen();
    }
}
