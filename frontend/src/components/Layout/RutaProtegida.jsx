import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protege una ruta: sin sesión redirige al login (y regresa después);
 * con soloAdmin, un cliente es enviado al inicio.
 */
export default function RutaProtegida({ children, soloAdmin = false }) {
  const { autenticado, esAdmin } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname + location.search }} />;
  }
  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
RutaProtegida.propTypes = { children: PropTypes.node.isRequired, soloAdmin: PropTypes.bool };
