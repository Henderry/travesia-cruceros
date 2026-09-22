import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReporteService from '../../services/ReporteService';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import StatCard from '../../components/ui/StatCard';
import EstadoPago from '../../components/ui/EstadoPago';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { crc, dia, fechaCorta, mesCorto } from '../../utils/formato';
import { colores } from '../../themes/theme';

/** Barras horizontales de una sola serie: ingresos (con IVA) por crucero */
function IngresosPorCrucero({ datos }) {
  const max = Math.max(...datos.map((d) => Number(d.Ingresos)), 1);
  return (
    <Stack spacing={1.75} role="list" aria-label="Ingresos por crucero">
      {datos.map((d) => {
        const valor = Number(d.Ingresos);
        return (
          <Box key={d.Id} role="listitem">
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.Nombre}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {crc(valor)} · {d.Reservas} {Number(d.Reservas) === 1 ? 'reserva' : 'reservas'}
              </Typography>
            </Stack>
            <Tooltip title={`${d.Nombre}: ${crc(valor)}`} placement="top" arrow>
              <Box sx={{ height: 20, display: 'flex', alignItems: 'center', cursor: 'default' }}>
                <Box sx={{ width: '100%', height: 10, borderRadius: 1, bgcolor: colores.arenaOscura, position: 'relative' }}>
                  <Box sx={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 1,
                    width: `${(valor / max) * 100}%`, minWidth: valor > 0 ? 6 : 0,
                    bgcolor: colores.oceano, transition: 'width .6s ease',
                  }} />
                </Box>
              </Box>
            </Tooltip>
          </Box>
        );
      })}
    </Stack>
  );
}
IngresosPorCrucero.propTypes = { datos: PropTypes.array.isRequired };

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { datos, cargando, error, recargar } = useApi(() => ReporteService.resumen(), []);

  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  const k = datos.Indicadores;
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <>
      <AdminEncabezado
        titulo={`${saludo}, ${usuario?.Nombre?.split(' ')[0]}`}
        subtitulo="Así va la operación de Travesía hoy."
        acciones={<Button component={RouterLink} to="/admin/cruceros/crear" variant="contained">Nuevo crucero</Button>}
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard etiqueta="Reservas" valor={k.Reservas} detalle={`${k.SalidasProximas} salidas programadas`} icono={<ConfirmationNumberRoundedIcon />} /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard etiqueta="Pasajeros" valor={k.Pasajeros} detalle={`${k.Clientes} clientes registrados`} icono={<GroupsRoundedIcon />} tono={colores.laguna} /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard etiqueta="Cobrado" valor={crc(k.Cobrado)} detalle="pagos registrados (con IVA)" icono={<PaidRoundedIcon />} tono={colores.exito} /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard etiqueta="Por cobrar" valor={crc(k.Pendiente)} detalle="reservas pendientes de pago" icono={<PendingActionsRoundedIcon />} tono={colores.alerta} /></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Ingresos por crucero</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Total de las reservas con IVA, pagadas y pendientes</Typography>
            <IngresosPorCrucero datos={datos.PorCrucero} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Próximas salidas</Typography>
            <Stack spacing={1.5}>
              {datos.ProximasSalidas.map((s) => (
                <Stack key={s.Id} direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 50, textAlign: 'center', borderRadius: 2, bgcolor: colores.arena, py: 0.75, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: colores.coral, textTransform: 'uppercase' }}>{mesCorto(s.FechaSalida)}</Typography>
                    <Typography sx={{ fontSize: 19, fontWeight: 800, lineHeight: 1 }}>{dia(s.FechaSalida)}</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>{s.Crucero}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.CantDias} días · {s.Reservas} {Number(s.Reservas) === 1 ? 'reserva' : 'reservas'}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="h6">Últimas reservas</Typography>
              <Button component={RouterLink} to="/admin/reservas" endIcon={<ArrowForwardRoundedIcon />}>Ver todas</Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow><TableCell>#</TableCell><TableCell>Cliente</TableCell><TableCell>Crucero</TableCell><TableCell>Salida</TableCell><TableCell>Estado</TableCell><TableCell align="right">Total</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {datos.UltimasReservas.map((r) => (
                    <TableRow key={r.Id} hover onClick={() => navigate(`/reservas/${r.Id}`)} sx={{ cursor: 'pointer' }}>
                      <TableCell sx={{ fontWeight: 700 }}>{r.Id}</TableCell>
                      <TableCell>{r.NombreUsuario}</TableCell>
                      <TableCell>{r.NombreCrucero}</TableCell>
                      <TableCell>{fechaCorta(r.FechaSalida)}</TableCell>
                      <TableCell><EstadoPago pagada={r.Pagada} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{crc(r.Total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
