import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'Reserva';
const BASE_URL_PAGO = import.meta.env.VITE_BASE_URL2 + 'InfoPagoC';

class ReservaService {
  // Administrador: todas las reservas. Cliente: solo las propias.
  getReservas() {
    return axios.get(BASE_URL);
  }

  getReservaById(reservaId) {
    return axios.get(`${BASE_URL}/${reservaId}`);
  }

  // La reserva queda a nombre del usuario autenticado; el precio lo calcula el servidor
  createReserva(reserva) {
    return axios.post(BASE_URL, reserva);
  }

  registrarPago(idReserva) {
    return axios.post(BASE_URL_PAGO, { IdReserva: idReserva });
  }
}

export default new ReservaService();
