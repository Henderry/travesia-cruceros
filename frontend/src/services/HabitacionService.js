  import axios from 'axios';
  //http://localhost:81/apiMovie/movie/
  const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'habitacion';
  class HabitacionService {
    //Definición para Llamar al API y obtener el listado de películas

    //Listas peliculas
    //localhost:81/apimovie/movie
    getHabitacion() {
      return axios.get(BASE_URL);
    }
    //Obtener pelicula
    //localhost:81/apimovie/movie/1
    getHabitacionById(HabitacionId){
      return axios.get(BASE_URL+'/'+HabitacionId);
    }

    
    //Obtener peliculas por tienda
    //localhost:81/apimovie/movie/moviesByShopRental/1

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
