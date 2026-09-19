import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box, Button, Card, Container, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DirectionsBoatRoundedIcon from '@mui/icons-material/DirectionsBoatRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import toast from 'react-hot-toast';
import ReservaService from '../services/ReservaService';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoDetalle, EstadoError } from '../components/ui/Estados';
import EstadoPago from '../components/ui/EstadoPago';
import PagoDialog from '../components/ui/PagoDialog';
import { descargarFactura } from '../components/factura/descargarFactura';
import { crc, fechaLarga, urlImagen } from '../utils/formato';
import { colores } from '../themes/theme';

function Dato({ icono, etiqueta, valor }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: colores.oceano, mt: 0.25, display: 'flex' }}>{icono}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{etiqueta}</Typography>
        <Typography sx={{ fontWeight: 600 }}>{valor}</Typography>
      </Box>
    </Stack>
  );
}
Dato.propTypes = { icono: PropTypes.node, etiqueta: PropTypes.string, valor: PropTypes.node };

export default function ReservaDetalle() {
  const { id } = useParams();
  const { esAdmin } = useAuth();
  const { datos: r, cargando, error, recargar } = useApi(() => ReservaService.getReservaById(id), [id]);
  const [pagar, setPagar] = useState(false);
  const [generando, setGenerando] = useState(false);

  const factura = async () => {
    setGenerando(true);
    try {
      await descargarFactura(r);
    } catch {
      toast.error('No se pudo generar la factura');
    } finally {
      setGenerando(false);
    }
  };

  if (cargando) return <Container maxWidth="lg" sx={{ py: 5 }}><CargandoDetalle /></Container>;
  if (error) return <Container maxWidth="lg" sx={{ py: 5 }}><EstadoError mensaje={error} onReintentar={recargar} /></Container>;

  const volver = esAdmin ? { label: 'Reservas', to: '/admin/reservas' } : { label: 'Mis reservas', to: '/mis-reservas' };

  return (
    <>
      <EncabezadoPagina
        titulo={`Reserva #${r.Id}`}
        subtitulo={`${r.NombreCrucero} · reservada el ${fechaLarga(r.FechaReserva?.slice(0, 10))}`}
        migas={[{ label: 'Inicio', to: '/' }, volver, { label: `#${r.Id}` }]}
        acciones={
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" color="inherit" sx={{ color: colores.tinta, bgcolor: '#fff' }} startIcon={<PictureAsPdfRoundedIcon />} onClick={factura} disabled={generando}>
              {generando ? 'Generando…' : 'Descargar factura'}
            </Button>
            {!r.Pagada && <Button variant="contained" color="secondary" onClick={() => setPagar(true)}>Pagar ahora</Button>}
          </Stack>
        }
      />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ overflow: 'hidden', mb: 3 }}>
              <Box sx={{ position: 'relative', height: 180 }}>
                <Box component="img" src={urlImagen(r.Foto)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(11,31,51,.8))' }} />
                <Box sx={{ position: 'absolute', left: 24, bottom: 18, color: '#fff' }}>
                  <Typography variant="h4">{r.NombreCrucero}</Typography>
                </Box>
                <Box sx={{ position: 'absolute', right: 18, top: 18 }}><EstadoPago pagada={r.Pagada} size="medium" /></Box>
              </Box>
              <Grid container spacing={3} sx={{ p: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}><Dato icono={<CalendarMonthRoundedIcon />} etiqueta="Fechas" valor={`${fechaLarga(r.FechaSalida)} → ${fechaLarga(r.FechaRegreso)}`} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Dato icono={<DirectionsBoatRoundedIcon />} etiqueta="Barco" valor={`${r.NombreBarco} · ${r.CantDias} días`} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Dato icono={<PlaceRoundedIcon />} etiqueta="Salida y regreso" valor={`${r.PuertoSalida} → ${r.PuertoRegreso}`} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Dato icono={<PersonRoundedIcon />} etiqueta="Titular de la cuenta" valor={`${r.NombreUsuario} · ${r.CorreoUsuario}`} /></Grid>
              </Grid>
            </Card>

            <Typography variant="h5" sx={{ mb: 1.5 }}>Camarotes</Typography>
            <TableContainer component={Card} sx={{ mb: 3 }}>
              <Table>
                <TableHead><TableRow><TableCell>Tipo</TableCell><TableCell align="right">Pasajeros</TableCell><TableCell align="right">Precio</TableCell></TableRow></TableHead>
                <TableBody>
                  {r.Habitaciones.map((h) => (
                    <TableRow key={h.IdHabitacion}>
                      <TableCell><Typography sx={{ fontWeight: 600 }}>{h.Tipo}</Typography><Typography variant="caption" color="text.secondary">{h.Descripcion}</Typography></TableCell>
                      <TableCell align="right">{h.CantPasajeros}</TableCell>
                      <TableCell align="right">{crc(h.Precio)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {r.Complementos.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 1.5 }}>Complementos</Typography>
                <TableContainer component={Card} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead><TableRow><TableCell>Servicio</TableCell><TableCell align="right">Cantidad</TableCell><TableCell align="right">Unitario</TableCell><TableCell align="right">Total</TableCell></TableRow></TableHead>
                    <TableBody>
                      {r.Complementos.map((c) => (
                        <TableRow key={c.IdComplemento}>
                          <TableCell>{c.Descripcion}</TableCell>
                          <TableCell align="right">{c.Cantidad}</TableCell>
                          <TableCell align="right">{crc(c.PrecioUnitario)}</TableCell>
                          <TableCell align="right">{crc(c.Total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {r.Huespedes.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 1.5 }}>Huéspedes</Typography>
                <TableContainer component={Card}>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell align="right">Edad</TableCell><TableCell align="right">Sexo</TableCell><TableCell align="right">Teléfono</TableCell></TableRow></TableHead>
                    <TableBody>
                      {r.Huespedes.map((h, i) => (
                        <TableRow key={i}>
                          <TableCell>{h.Nombre}</TableCell>
                          <TableCell align="right">{h.Edad ?? '—'}</TableCell>
                          <TableCell align="right">{h.Sexo || '—'}</TableCell>
                          <TableCell align="right">{h.Telefono || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 100 } }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Resumen de pago</Typography>
              <Stack spacing={1}>
                {[
                  ['Camarotes', r.TotalHabitaciones],
                  ['Complementos', r.TotalComplementos],
                  ['Subtotal', r.Subtotal],
                  [`IVA (${r.IVAPorcentaje}%)`, r.IVA],
                ].map(([l, v]) => (
                  <Stack key={l} direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{l}</Typography>
                    <Typography>{crc(v)}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: colores.tinta }}>{crc(r.Total)}</Typography>
              </Stack>
              <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, bgcolor: r.Pagada ? 'rgba(46,139,87,.08)' : 'rgba(201,138,18,.10)' }}>
                {r.Pagada ? (
                  <Typography variant="body2">Pagado el <b>{fechaLarga(r.FechaPago)}</b> por {crc(r.MontoPagado)}.</Typography>
                ) : (
                  <Typography variant="body2">Pendiente. Fecha límite de pago: <b>{fechaLarga(r.FechaLimitePago)}</b>.</Typography>
                )}
              </Box>
              {!r.Pagada && <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => setPagar(true)}>Pagar {crc(r.Total)}</Button>}
              <Button fullWidth variant="outlined" sx={{ mt: 1.5 }} startIcon={<PictureAsPdfRoundedIcon />} onClick={factura} disabled={generando}>
                Factura en PDF
              </Button>
              <Button fullWidth sx={{ mt: 1 }} component={RouterLink} to={volver.to}>Volver a {volver.label.toLowerCase()}</Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <PagoDialog abierto={pagar} reserva={r} onCerrar={() => setPagar(false)} onPagado={() => { setPagar(false); recargar(); }} />
    </>
  );
}
