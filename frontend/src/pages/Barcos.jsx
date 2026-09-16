import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardActionArea, Container, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import BarcoService from '../services/BarcoService';
import useApi from '../hooks/useApi';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoTarjetas, EstadoError } from '../components/ui/Estados';
import { urlImagen } from '../utils/formato';
import { colores, sombra } from '../themes/theme';

export default function Barcos() {
  const { datos, cargando, error, recargar } = useApi(() => BarcoService.catalogo(), []);

  return (
    <>
      <EncabezadoPagina
        titulo="Nuestra flota"
        subtitulo="Barcos pensados para cada estilo de viaje: desde grandes buques con teatro y spa hasta embarcaciones íntimas enfocadas en gastronomía."
        migas={[{ label: 'Inicio', to: '/' }, { label: 'Barcos' }]}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {cargando && <CargandoTarjetas cantidad={4} alto={240} />}
        {error && <EstadoError mensaje={error} onReintentar={recargar} />}
        <Grid container spacing={3}>
          {(datos || []).map((b) => (
            <Grid key={b.Id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%', transition: 'all .25s', '&:hover': { transform: 'translateY(-4px)', boxShadow: sombra.media } }}>
                <CardActionArea component={RouterLink} to={`/barcos/${b.Id}`} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', height: '100%' }}>
                  <Box component="img" src={urlImagen(b.Foto)} alt={b.Nombre} loading="lazy"
                    sx={{ width: { xs: '100%', sm: 220 }, height: { xs: 190, sm: 'auto' }, minHeight: { sm: 220 }, objectFit: 'cover', flexShrink: 0 }} />
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5">{b.Nombre}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>{b.Descripcion}</Typography>
                    <Stack direction="row" spacing={2.5} sx={{ mt: 'auto', color: colores.textoSuave, flexWrap: 'wrap', rowGap: 1 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center"><GroupsRoundedIcon sx={{ fontSize: 18, color: colores.laguna }} /><Typography variant="body2">{Number(b.Capacidad).toLocaleString('es-CR')} pasajeros</Typography></Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center"><BedRoundedIcon sx={{ fontSize: 18, color: colores.laguna }} /><Typography variant="body2">{Number(b.Camarotes).toLocaleString('es-CR')} camarotes</Typography></Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center"><SailingRoundedIcon sx={{ fontSize: 18, color: colores.laguna }} /><Typography variant="body2">{b.Cruceros} {b.Cruceros === 1 ? 'ruta' : 'rutas'}</Typography></Stack>
                    </Stack>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
