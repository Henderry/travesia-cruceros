import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'barco';

class BarcoService {
  // Obtener el listado de barcos
  getBarcos() {
    return axios.get(BASE_URL);
  }
  
  // Obtener el detalle de un barco por su id
  getBarcoById(barcoId) {
    return axios.get(`${BASE_URL}/${barcoId}`);
  }
  
  getListaHabitacionesByBarco(barcoId) {
    return axios.get(`${BASE_URL}/getListaHabitacionesByBarco/${barcoId}`); 
  }

  // Crear un nuevo barco
  createBarco(barco) {
    return axios.post(BASE_URL, JSON.stringify(barco));
  }
  
  // Actualizar un barco existente
  updateBarco(barco) {
    return axios.put(BASE_URL, JSON.stringify(barco));
  }
  catalogo() {
    return axios.get(`${BASE_URL}/catalogo`);
  }

  detalle(id) {
    return axios.get(`${BASE_URL}/detalle/${id}`);
  }

}

export default new BarcoService();
