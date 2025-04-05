import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'ComplementoC';

class ComplementoService {
  // notar: nombre corregido a getComplementos() (antes había un typo)
  getComplementos() {
    return axios.get(`${BASE_URL}/index`);  
    // o `/all` si tu controller mapea así: ComplementoC->index()
  }

  getComplementoById(id) {
    return axios.get(`${BASE_URL}/get/${id}`);
  }
}

export default new ComplementoService();
