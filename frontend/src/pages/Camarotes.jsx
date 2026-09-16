import {
  Box, Card, Chip, Container, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import HabitacionService from '../services/HabitacionService';
import useApi from '../hooks/useApi';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoTarjetas, EstadoError } from '../components/ui/Estados';
import { crc } from '../utils/formato';
import { colores } from '../themes/theme';

const acentos = [colores.laguna, colores.oceano, colores.coral, colores.tinta];

export default function Camarotes() {
  const { datos, cargando, error, recargar } = useApi(() => HabitacionService.getHabitacion(), []);
  const lista = [...(datos || [])].sort((a, b) => Number(a.Precio) - Number(b.Precio));

  return (
    <>
      <EncabezadoPagina
        titulo="Tipos de camarote"
        subtitulo="Desde camarotes interiores con la mejor tarifa hasta suites con sala y servicio de mayordomo. El precio final depende de la fecha de salida."
        migas={[{ label: 'Inicio', to: '/' }, { label: 'Camarotes' }]}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {cargando && <CargandoTarjetas cantidad={4} alto={80} />}
        {error && <EstadoError mensaje={error} onReintentar={recargar} />}
        <Grid container spacing={3}>
          {lista.map((h, i) => (
            <Grid key={h.Id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ height: 6, bgcolor: acentos[i % acentos.length] }} />
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  {i === lista.length - 1 && lista.length > 1 && (
                    <Chip label="La más exclusiva" size="small" sx={{ alignSelf: 'flex-start', mb: 1.5, bgcolor: 'rgba(224,122,95,.14)', color: colores.coralOscuro }} />
                  )}
                  <Typography variant="h5">{h.Tipo}</Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 1, mb: 2.5, flexGrow: 1 }}>{h.Descripcion}</Typography>
                  <Stack spacing={1} sx={{ color: 'text.secondary', mb: 2.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center"><SquareFootRoundedIcon fontSize="small" sx={{ color: colores.laguna }} /><Typography variant="body2">{h.Tamano} m²</Typography></Stack>
                    <Stack direction="row" spacing={1} alignItems="center"><GroupsRoundedIcon fontSize="small" sx={{ color: colores.laguna }} /><Typography variant="body2">{h.MinHuespedes} a {h.MaxHuespedes} huéspedes</Typography></Stack>
                  </Stack>
                  <Box sx={{ pt: 2, borderTop: `1px dashed ${colores.borde}` }}>
                    <Typography variant="caption" color="text.secondary">Tarifa base desde</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: colores.tinta }}>{crc(h.Precio)}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
