import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'ReporteC';

class ReporteService {
  resumen() {
    return axios.get(`${BASE_URL}/resumen`);
  }
}

export default new ReporteService();
