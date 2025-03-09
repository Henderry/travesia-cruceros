import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'Reserva';

class BarcoService {
  // Obtener el listado de barcos
  getReservas() {
    return axios.get(BASE_URL);
  }
  
  // Obtener el detalle de un barco por su id
  getReservaById(ReservaId) {
    return axios.get(`${BASE_URL}/${ReservaId}`);
  }
  
  getItinerarioById(CruceroId) {
    return axios.get(`${BASE_URL}/getItinerarioById/${CruceroId}`); 
  }

  getFechasCruceroById(CruceroId) {
    return axios.get(`${BASE_URL}/getFechasCruceroById/${CruceroId}`); 
  }

  // Crear un nuevo barco
  createBarco(barco) {
    return axios.post(BASE_URL, JSON.stringify(barco));
  }
  
  // Actualizar un barco existente
  updateBarco(barco) {
    return axios.put(BASE_URL, JSON.stringify(barco));
  }
}

export default new BarcoService();
