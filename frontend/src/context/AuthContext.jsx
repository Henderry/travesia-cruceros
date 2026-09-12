import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../services/AuthService';
import { CLAVE_SESION, leerSesion } from '../services/api';

const AuthContext = createContext(null);

function sesionVigente() {
  const sesion = leerSesion();
  if (!sesion?.token) return null;
  try {
    const { exp } = jwtDecode(sesion.token);
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
    return sesion;
  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionVigente);

  const guardar = useCallback((data) => {
    const nueva = { token: data.token, usuario: data.usuario };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
    setSesion(nueva);
    return nueva.usuario;
  }, []);

  const login = useCallback(
    async (correo, contrasena) => guardar((await AuthService.login(correo, contrasena)).data),
    [guardar]
  );

  const registrar = useCallback(async (datos) => guardar((await AuthService.registrar(datos)).data), [guardar]);

  const logout = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }, []);

  useEffect(() => {
    const alExpirar = () => setSesion(null);
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, []);

  const valor = useMemo(
    () => ({
      usuario: sesion?.usuario || null,
      autenticado: Boolean(sesion),
      esAdmin: sesion?.usuario?.Rol === 'Administrador',
      login,
      registrar,
      logout,
    }),
    [sesion, login, registrar, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
