import { useCallback, useEffect, useState } from 'react';
import { mensajeError } from '../utils/formato';

/**
 * Ejecuta una llamada al API y expone { datos, cargando, error, recargar }.
 * `llamada` debe devolver una promesa de Axios.
 */
export default function useApi(llamada, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ejecutar = useCallback(llamada, dependencias);

  const recargar = useCallback(() => {
    let activo = true;
    setEstado((e) => ({ ...e, cargando: true, error: null }));
    ejecutar()
      .then((res) => activo && setEstado({ datos: res.data, cargando: false, error: null }))
      .catch((err) => activo && setEstado({ datos: null, cargando: false, error: mensajeError(err) }));
    return () => {
      activo = false;
    };
  }, [ejecutar]);

  useEffect(() => recargar(), [recargar]);

  return { ...estado, recargar };
}
