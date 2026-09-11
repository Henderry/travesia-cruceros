import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'ComplementoC';

class ComplementoService {
  getComplementos() {
    return axios.get(BASE_URL);
  }

  getComplementoById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createComplemento(complemento) {
    return axios.post(BASE_URL, complemento);
  }

  updateComplemento(complemento) {
    return axios.put(BASE_URL, complemento);
  }

  deleteComplemento(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`);
  }
}

export default new ComplementoService();
