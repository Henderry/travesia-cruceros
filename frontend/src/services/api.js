import axios from 'axios';

// Interceptores de Axios: envía el token de sesión y cierra la sesión si el API responde 401.
export const CLAVE_SESION = 'travesia.sesion';
export const BASE_URL = import.meta.env.VITE_BASE_URL2;

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
  } catch {
    return null;
  }
}

axios.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion?.token) {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  if (typeof config.data === 'string' || (config.data && !(config.data instanceof FormData))) {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && leerSesion()) {
      localStorage.removeItem(CLAVE_SESION);
      window.dispatchEvent(new Event('sesion-expirada'));
    }
    return Promise.reject(error);
  }
);

export default axios;
