import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import toast from 'react-hot-toast';
import ReservaService from '../../services/ReservaService';
import { crc, mensajeError } from '../../utils/formato';
import { formatearNumero, formatearVencimiento, luhnValido, marcaTarjeta, vencimientoValido } from '../../utils/tarjeta';

/** Diálogo para pagar una reserva pendiente */
export default function PagoDialog({ abierto, reserva, onCerrar, onPagado }) {
  const [t, setT] = useState({ numero: '', vence: '', cvv: '', titular: '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const pagar = async () => {
    const e = {};
    if (!luhnValido(t.numero)) e.numero = 'Número de tarjeta no válido';
    if (!vencimientoValido(t.vence)) e.vence = 'Fecha no válida';
    if (!/^\d{3,4}$/.test(t.cvv)) e.cvv = 'CVV no válido';
    if (t.titular.trim().length < 3) e.titular = 'Requerido';
    setErrores(e);
    if (Object.keys(e).length) return;
    setEnviando(true);
    try {
      await ReservaService.registrarPago(reserva.Id);
      toast.success('Pago registrado');
      setT({ numero: '', vence: '', cvv: '', titular: '' });
      onPagado();
    } catch (err) {
      toast.error(mensajeError(err, 'No se pudo registrar el pago'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '1.5rem' }}>Pagar reserva #{reserva?.Id}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Total a pagar: <b>{crc(reserva?.Total)}</b> (IVA incluido)
        </Typography>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={12}>
            <TextField fullWidth label="Número de tarjeta" value={t.numero} autoComplete="cc-number"
              onChange={(e) => setT({ ...t, numero: formatearNumero(e.target.value) })}
              error={!!errores.numero} helperText={errores.numero || marcaTarjeta(t.numero) || 'Prueba: 4111 1111 1111 1111'} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="Vence (MM/AA)" value={t.vence} onChange={(e) => setT({ ...t, vence: formatearVencimiento(e.target.value) })} error={!!errores.vence} helperText={errores.vence} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="CVV" type="password" value={t.cvv} onChange={(e) => setT({ ...t, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} error={!!errores.cvv} helperText={errores.cvv} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Titular" value={t.titular} onChange={(e) => setT({ ...t, titular: e.target.value })} error={!!errores.titular} helperText={errores.titular} />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: 'text.secondary' }}>
          <LockRoundedIcon fontSize="small" />
          <Typography variant="caption">La tarjeta no se guarda en nuestros sistemas.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onCerrar} disabled={enviando}>Cancelar</Button>
        <Button variant="contained" color="secondary" onClick={pagar} disabled={enviando}>
          {enviando ? 'Procesando…' : `Pagar ${crc(reserva?.Total)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
PagoDialog.propTypes = {
  abierto: PropTypes.bool.isRequired,
  reserva: PropTypes.shape({ Id: PropTypes.number, Total: PropTypes.number }),
  onCerrar: PropTypes.func.isRequired,
  onPagado: PropTypes.func.isRequired,
};
