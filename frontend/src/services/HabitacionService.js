  import axios from 'axios';
  const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'habitacion';
  class HabitacionService {
    // Listado de habitaciones
    getHabitacion() {
      return axios.get(BASE_URL);
    }
    // Detalle de una habitación
    getHabitacionById(HabitacionId){
      return axios.get(BASE_URL+'/'+HabitacionId);
    }


    // Crear una habitación
    createHabitacion(habitacion) {
      return axios.post(BASE_URL, JSON.stringify(habitacion));
  }

  updateHabitacion(habitacion) {
    return axios({
        method: 'put',
        url: BASE_URL,
        data: JSON.stringify(habitacion)
    });
  }
  getTiposHabitacion() {
    return axios.get(`${BASE_URL}/tipos`);
  }

  }
  export default new HabitacionService();
