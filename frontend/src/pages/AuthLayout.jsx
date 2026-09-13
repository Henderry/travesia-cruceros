import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Logo from '../components/ui/Logo';
import { urlImagen } from '../utils/formato';
import { colores } from '../themes/theme';

/** Pantalla dividida para login y registro */
export default function AuthLayout({ titulo, subtitulo, children, imagen = 'caribe-colonial.jpg' }) {
  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <Box component="img" src={urlImagen(imagen)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(11,31,51,.35) 0%, rgba(11,31,51,.85) 100%)` }} />
        <Box sx={{ position: 'relative', height: '100%', p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
            <Logo claro />
          </Box>
          <Box>
            <Typography variant="h2" sx={{ fontSize: '2.8rem', maxWidth: 480 }}>
              El Caribe y el Pacífico, a un clic de distancia.
            </Typography>
            <Typography sx={{ mt: 2, color: 'rgba(255,255,255,.78)', maxWidth: 440 }}>
              Administre sus reservas, descargue sus facturas y pague cuando esté listo.
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 6 } }}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box component={RouterLink} to="/" sx={{ display: { xs: 'inline-block', md: 'none' }, mb: 4, textDecoration: 'none' }}>
            <Logo />
          </Box>
          <Typography variant="h3" sx={{ fontSize: '2.2rem', color: colores.tinta }}>{titulo}</Typography>
          {subtitulo && <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>{subtitulo}</Typography>}
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}
AuthLayout.propTypes = {
  titulo: PropTypes.node.isRequired,
  subtitulo: PropTypes.node,
  children: PropTypes.node.isRequired,
  imagen: PropTypes.string,
};
