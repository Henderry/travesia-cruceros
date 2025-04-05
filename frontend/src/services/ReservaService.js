import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL2 + 'Reserva';
const BASE_URL_PAGO = import.meta.env.VITE_BASE_URL2 + 'InfoPagoC';

class ReservaService {
  // Obtener todas las reservas
  getReservas() {
    return axios.get(BASE_URL);
  }

  // Obtener detalle de una reserva por ID
  getReservaById(reservaId) {
    return axios.get(`${BASE_URL}/${reservaId}`);
  }

  // Crear una nueva reserva
  createReserva(reserva) {
    return axios.post(BASE_URL, {
      ...reserva,
      IdUsuario: parseInt(reserva.IdUsuario, 10),
      IdCrucero: parseInt(reserva.IdCrucero, 10),
      IdFechaCrucero: parseInt(reserva.IdFechaCrucero, 10)
    });
  }
  registrarPagoCompleto(idReserva) {
    return axios.post(BASE_URL_PAGO, { IdReserva: idReserva });
  }

}

export default new ReservaService();