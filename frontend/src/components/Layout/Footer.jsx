import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Divider, Link, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import Logo from '../ui/Logo';
import { colores } from '../../themes/theme';

const columnas = [
  {
    titulo: 'Explorar',
    enlaces: [
      { to: '/cruceros', label: 'Todos los cruceros' },
      { to: '/barcos', label: 'Nuestros barcos' },
      { to: '/camarotes', label: 'Tipos de camarote' },
    ],
  },
  {
    titulo: 'Mi viaje',
    enlaces: [
      { to: '/reservar', label: 'Reservar un crucero' },
      { to: '/mis-reservas', label: 'Mis reservas' },
      { to: '/login', label: 'Iniciar sesión' },
    ],
  },
];

export function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: colores.tinta, color: 'rgba(255,255,255,.72)', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Logo claro />
            <Typography sx={{ mt: 2, maxWidth: 320 }}>
              Rutas por el Caribe y el Pacífico con salida desde Costa Rica. Reserve su camarote en minutos y
              reciba su factura al instante.
            </Typography>
          </Grid>
          {columnas.map((c) => (
            <Grid key={c.titulo} size={{ xs: 6, md: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>{c.titulo}</Typography>
              <Stack spacing={1.25}>
                {c.enlaces.map((e) => (
                  <Link key={e.to} component={RouterLink} to={e.to} sx={{ color: 'inherit', '&:hover': { color: '#fff' } }}>
                    {e.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Contacto</Typography>
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1.25} alignItems="center"><PlaceOutlinedIcon fontSize="small" /><span>Alajuela, Costa Rica</span></Stack>
              <Stack direction="row" spacing={1.25} alignItems="center"><PhoneRoundedIcon fontSize="small" /><span>+506 2222 2222</span></Stack>
              <Stack direction="row" spacing={1.25} alignItems="center"><MailOutlineRoundedIcon fontSize="small" /><span>reservas@travesia.test</span></Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,.12)' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Typography variant="body2">© {new Date().getFullYear()} Travesía Cruceros</Typography>
          <Typography variant="body2">Proyecto académico · Ingeniería del Software, UTN</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
