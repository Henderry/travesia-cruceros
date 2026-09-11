import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'Crucero';

class CruceroService {
  // Obtener el listado de barcos
  getCruceros() {
    return axios.get(BASE_URL);
  }
  
  // Obtener el detalle de un barco por su id
  getCruceroById(CruceroId) {
    return axios.get(`${BASE_URL}/${CruceroId}`);
  }
  
  getItinerarioById(CruceroId) {
    return axios.get(`${BASE_URL}/getItinerarioById/${CruceroId}`); 
  }

  getHabitacionesById(CruceroId) {
    return axios.get(`${BASE_URL}/getHabitacionesById/${CruceroId}`); 
  }


  getFechasCruceroById(CruceroId) {
    return axios.get(`${BASE_URL}/getFechasCruceroById/${CruceroId}`); 
  }
  getUpdate(Crucero) {
    return axios.get(`${BASE_URL}/getUpdate/${Crucero}`); 
  }
  // Crear un nuevo barco
  createCrucero(crucero) {
    return axios.post(BASE_URL, JSON.stringify(crucero));
  }
  
  // Actualizar un barco existente
  updateCrucero(crucero) {
    return axios.put(BASE_URL, JSON.stringify(crucero));
  }
  getPuertos() {
    return axios.get(import.meta.env.VITE_BASE_URL2 + 'puertoC');
  }
  


  
  // Actualizar crucero

  // Catálogo público con próxima salida y precio desde
  catalogo() {
    return axios.get(`${BASE_URL}/catalogo`);
  }

  // Detalle público: itinerario y salidas con tarifas
  detalle(id) {
    return axios.get(`${BASE_URL}/detalle/${id}`);
  }

}

export default new CruceroService();
