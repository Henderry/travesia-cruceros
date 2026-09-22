import { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Stack, Toolbar, Typography,
} from '@mui/material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import DirectionsBoatRoundedIcon from '@mui/icons-material/DirectionsBoatRounded';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import Logo from '../ui/Logo';
import { CargandoDetalle } from '../ui/Estados';
import { useAuth } from '../../context/AuthContext';
import { iniciales } from '../../utils/formato';
import { colores } from '../../themes/theme';

const ANCHO = 264;
const secciones = [
  { to: '/admin', label: 'Resumen', icono: <SpaceDashboardRoundedIcon />, end: true },
  { to: '/admin/reservas', label: 'Reservas', icono: <ConfirmationNumberRoundedIcon /> },
  { to: '/admin/cruceros', label: 'Cruceros', icono: <SailingRoundedIcon /> },
  { to: '/admin/barcos', label: 'Barcos', icono: <DirectionsBoatRoundedIcon /> },
  { to: '/admin/camarotes', label: 'Camarotes', icono: <BedRoundedIcon /> },
  { to: '/admin/complementos', label: 'Complementos', icono: <SpaRoundedIcon /> },
  { to: '/admin/usuarios', label: 'Usuarios', icono: <PeopleAltRoundedIcon /> },
];

function MenuLateral({ onNavegar }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: colores.tinta, color: 'rgba(255,255,255,.75)' }}>
      <Box component={RouterLink} to="/" sx={{ p: 3, textDecoration: 'none' }}>
        <Logo claro size={34} />
      </Box>
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,.4)' }}>Administración</Typography>
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {secciones.map((s) => (
          <ListItemButton
            key={s.to}
            component={NavLink}
            to={s.to}
            end={s.end}
            onClick={onNavegar}
            sx={{
              borderRadius: 2.5, mb: 0.5, color: 'inherit',
              '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,.55)', minWidth: 40 },
              '&:hover': { bgcolor: 'rgba(255,255,255,.06)' },
              '&.active': { bgcolor: 'rgba(58,175,169,.18)', color: '#fff', '& .MuiListItemIcon-root': { color: colores.laguna } },
            }}
          >
            <ListItemIcon>{s.icono}</ListItemIcon>
            <ListItemText primary={s.label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth component={RouterLink} to="/" endIcon={<OpenInNewRoundedIcon />}
          sx={{ color: 'rgba(255,255,255,.8)', border: '1px solid rgba(255,255,255,.15)' }}
        >
          Ver sitio público
        </Button>
      </Box>
    </Box>
  );
}
MenuLateral.propTypes = { onNavegar: PropTypes.func };

/** Layout del panel de administración: menú lateral + barra superior */
export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colores.arena }}>
      <Box component="nav" sx={{ width: { lg: ANCHO }, flexShrink: 0 }}>
        <Drawer variant="temporary" open={abierto} onClose={() => setAbierto(false)} sx={{ display: { lg: 'none' }, '& .MuiDrawer-paper': { width: ANCHO, border: 0 } }}>
          <MenuLateral onNavegar={() => setAbierto(false)} />
        </Drawer>
        <Drawer variant="permanent" open sx={{ display: { xs: 'none', lg: 'block' }, '& .MuiDrawer-paper': { width: ANCHO, border: 0 } }}>
          <MenuLateral />
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(247,243,236,.85)', backdropFilter: 'blur(10px)', color: colores.texto, borderBottom: `1px solid ${colores.borde}` }}>
          <Toolbar sx={{ gap: 2 }}>
            <IconButton sx={{ display: { lg: 'none' } }} onClick={() => setAbierto(true)} aria-label="Abrir menú">
              <MenuRoundedIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{usuario?.Nombre}</Typography>
                <Typography variant="caption" color="text.secondary">{usuario?.Rol}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: colores.oceano, width: 38, height: 38, fontSize: '0.9rem', fontWeight: 700 }}>
                {iniciales(usuario?.Nombre)}
              </Avatar>
              <Divider orientation="vertical" flexItem />
              <IconButton aria-label="Cerrar sesión" onClick={() => { logout(); navigate('/'); }}>
                <LogoutRoundedIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
          <Suspense fallback={<CargandoDetalle />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
