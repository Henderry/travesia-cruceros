import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Card, Container, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ReservaService from '../services/ReservaService';
import useApi from '../hooks/useApi';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoTarjetas, EstadoError, EstadoVacio } from '../components/ui/Estados';
import EstadoPago from '../components/ui/EstadoPago';
import PagoDialog from '../components/ui/PagoDialog';
import { crc, fechaCorta, fechaLarga, sumarDias, urlImagen } from '../utils/formato';
import { colores } from '../themes/theme';

export default function MisReservas() {
  const { datos, cargando, error, recargar } = useApi(() => ReservaService.getReservas(), []);
  const [pagar, setPagar] = useState(null);

  return (
    <>
      <EncabezadoPagina
        titulo="Mis reservas"
        subtitulo="Consulte sus viajes, pague lo pendiente y descargue sus facturas."
        migas={[{ label: 'Inicio', to: '/' }, { label: 'Mis reservas' }]}
        acciones={<Button component={RouterLink} to="/reservar" variant="contained" color="secondary">Nueva reserva</Button>}
      />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {cargando && <CargandoTarjetas cantidad={3} alto={120} />}
        {error && <EstadoError mensaje={error} onReintentar={recargar} />}
        {datos && datos.length === 0 && (
          <EstadoVacio
            titulo="Aún no tiene reservas"
            texto="Cuando reserve un crucero, aparecerá aquí con su factura."
            accion={<Button component={RouterLink} to="/cruceros" variant="contained">Explorar cruceros</Button>}
          />
        )}
        <Stack spacing={2.5}>
          {(datos || []).map((r) => (
            <Card key={r.Id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, overflow: 'hidden' }}>
              <Box component="img" src={urlImagen(r.Foto)} alt="" sx={{ width: { xs: '100%', sm: 220 }, height: { xs: 160, sm: 'auto' }, objectFit: 'cover' }} />
              <Grid container sx={{ p: 3, flexGrow: 1 }} spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>RESERVA #{r.Id}</Typography>
                    <EstadoPago pagada={r.Pagada} />
                  </Stack>
                  <Typography variant="h5">{r.NombreCrucero}</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ sm: 2.5 }} sx={{ mt: 1, color: 'text.secondary' }}>
                    <Stack direction="row" spacing={0.75} alignItems="center"><CalendarMonthRoundedIcon sx={{ fontSize: 18 }} /><Typography variant="body2">{fechaCorta(r.FechaSalida)} → {fechaCorta(sumarDias(r.FechaSalida, r.CantDias))}</Typography></Stack>
                    <Stack direction="row" spacing={0.75} alignItems="center"><GroupsRoundedIcon sx={{ fontSize: 18 }} /><Typography variant="body2">{r.Pasajeros} pasajeros</Typography></Stack>
                  </Stack>
                  {!r.Pagada && (
                    <Typography variant="body2" sx={{ mt: 1, color: colores.alerta, fontWeight: 600 }}>Pagar antes del {fechaLarga(r.FechaLimitePago)}</Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Total con IVA</Typography>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: colores.tinta }}>{crc(r.Total)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack spacing={1}>
                    <Button variant="outlined" component={RouterLink} to={`/reservas/${r.Id}`}>Ver detalle</Button>
                    {!r.Pagada && <Button variant="contained" color="secondary" onClick={() => setPagar(r)}>Pagar ahora</Button>}
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Container>
      <PagoDialog abierto={Boolean(pagar)} reserva={pagar} onCerrar={() => setPagar(null)} onPagado={() => { setPagar(null); recargar(); }} />
    </>
  );
}
