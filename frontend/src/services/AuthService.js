import axios from './api';
const BASE = import.meta.env.VITE_BASE_URL2 + 'usuarioC';

class AuthService {
  login(Correo, Contrasena) {
    return axios.post(`${BASE}/login`, { Correo, Contrasena });
  }
  registrar(datos) {
    return axios.post(`${BASE}/registrar`, datos);
  }
  perfil() {
    return axios.get(`${BASE}/perfil`);
  }
  usuarios() {
    return axios.get(BASE);
  }
}

export default new AuthService();
