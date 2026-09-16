import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box, Card, CardActionArea, Container, LinearProgress, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import BarcoService from '../services/BarcoService';
import useApi from '../hooks/useApi';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoDetalle, EstadoError } from '../components/ui/Estados';
import StatCard from '../components/ui/StatCard';
import { crc, fechaCorta, urlImagen } from '../utils/formato';
import { colores } from '../themes/theme';

export default function BarcoDetalle() {
  const { id } = useParams();
  const { datos: b, cargando, error, recargar } = useApi(() => BarcoService.detalle(id), [id]);

  if (cargando) return <Container maxWidth="lg" sx={{ py: 5 }}><CargandoDetalle /></Container>;
  if (error) return <Container maxWidth="lg" sx={{ py: 5 }}><EstadoError mensaje={error} onReintentar={recargar} /></Container>;

  const totalCamarotes = b.Habitaciones.reduce((s, h) => s + Number(h.CantDisponible), 0);

  return (
    <>
      <EncabezadoPagina
        titulo={b.Nombre}
        subtitulo={b.Descripcion}
        migas={[{ label: 'Inicio', to: '/' }, { label: 'Barcos', to: '/barcos' }, { label: b.Nombre }]}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 4 }}><StatCard etiqueta="Capacidad" valor={Number(b.Capacidad).toLocaleString('es-CR')} detalle="pasajeros" icono={<GroupsRoundedIcon />} /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><StatCard etiqueta="Camarotes" valor={totalCamarotes.toLocaleString('es-CR')} detalle={`${b.Habitaciones.length} categorías`} icono={<BedRoundedIcon />} tono={colores.laguna} /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><StatCard etiqueta="Rutas" valor={b.Cruceros.length} detalle="cruceros activos" icono={<SquareFootRoundedIcon />} tono={colores.coral} /></Grid>
        </Grid>

        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Camarotes a bordo</Typography>
            <Stack spacing={2}>
              {b.Habitaciones.map((h) => (
                <Card key={h.Id} sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{h.Tipo}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{h.Descripcion}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {h.Tamano} m² · {h.MinHuespedes}–{h.MaxHuespedes} huéspedes · tarifa base {crc(h.Precio)}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 150, textAlign: { sm: 'right' } }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: colores.tinta }}>{Number(h.CantDisponible).toLocaleString('es-CR')}</Typography>
                      <Typography variant="caption" color="text.secondary">camarotes</Typography>
                      <LinearProgress variant="determinate" value={(Number(h.CantDisponible) / totalCamarotes) * 100}
                        sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: colores.arenaOscura, '& .MuiLinearProgress-bar': { bgcolor: colores.laguna } }} />
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Rutas de este barco</Typography>
            <Stack spacing={2}>
              {b.Cruceros.map((c) => (
                <Card key={c.Id}>
                  <CardActionArea component={RouterLink} to={`/cruceros/${c.Id}`} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                    <Box component="img" src={urlImagen(c.Foto)} alt={c.Nombre} sx={{ width: 120, height: 96, objectFit: 'cover' }} />
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 700 }}>{c.Nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {c.ProximaSalida ? `Próxima salida: ${fechaCorta(c.ProximaSalida)}` : 'Sin salidas programadas'}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
