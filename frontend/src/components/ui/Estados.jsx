import PropTypes from 'prop-types';
import {
  Box, Button, Card, CardContent, Skeleton, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { colores } from '../../themes/theme';

/** Tarjetas fantasma mientras cargan los datos */
export function CargandoTarjetas({ cantidad = 6, alto = 200 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: cantidad }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <Skeleton variant="rectangular" height={alto} />
            <CardContent>
              <Skeleton width="40%" />
              <Skeleton width="80%" height={32} />
              <Skeleton width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
CargandoTarjetas.propTypes = { cantidad: PropTypes.number, alto: PropTypes.number };

export function CargandoDetalle() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={320} />
      <Skeleton width="50%" height={48} />
      <Skeleton width="80%" />
      <Skeleton width="70%" />
    </Stack>
  );
}

export function EstadoError({ mensaje, onReintentar }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Box
        sx={{
          width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '50%',
          display: 'grid', placeItems: 'center', bgcolor: 'rgba(224,122,95,.12)', color: colores.coral,
        }}
      >
        <ErrorOutlineRoundedIcon fontSize="large" />
      </Box>
      <Typography variant="h5" gutterBottom>No pudimos cargar esta información</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
        {mensaje}
      </Typography>
      {onReintentar && (
        <Button variant="outlined" onClick={onReintentar}>Intentar de nuevo</Button>
      )}
    </Box>
  );
}
EstadoError.propTypes = { mensaje: PropTypes.string, onReintentar: PropTypes.func };

export function EstadoVacio({ titulo, texto, accion }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Box
        sx={{
          width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '50%',
          display: 'grid', placeItems: 'center', bgcolor: 'rgba(58,175,169,.14)', color: colores.oceano,
        }}
      >
        <InboxRoundedIcon fontSize="large" />
      </Box>
      <Typography variant="h5" gutterBottom>{titulo}</Typography>
      {texto && (
        <Typography color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>{texto}</Typography>
      )}
      {accion}
    </Box>
  );
}
EstadoVacio.propTypes = { titulo: PropTypes.string.isRequired, texto: PropTypes.string, accion: PropTypes.node };
