import { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { iniciales } from '../../utils/formato';
import { colores } from '../../themes/theme';

const enlaces = [
  { to: '/cruceros', label: 'Cruceros' },
  { to: '/barcos', label: 'Nuestros barcos' },
  { to: '/camarotes', label: 'Camarotes' },
];

export default function Header() {
  const { usuario, autenticado, esAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scroll, setScroll] = useState(false);
  const [anclaMenu, setAnclaMenu] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const esInicio = pathname === '/';
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const transparente = esInicio && !scroll;

  const salir = () => {
    setAnclaMenu(null);
    setDrawer(false);
    logout();
    navigate('/');
  };

  const colorEnlace = transparente ? 'rgba(255,255,255,.88)' : colores.texto;

  return (
    <>
      <AppBar
        position={esInicio ? 'fixed' : 'sticky'}
        elevation={0}
        sx={{
          bgcolor: transparente ? 'transparent' : 'rgba(255,255,255,.9)',
          backdropFilter: transparente ? 'none' : 'saturate(180%) blur(12px)',
          borderBottom: transparente ? '1px solid transparent' : `1px solid ${colores.borde}`,
          transition: 'background-color .3s ease, border-color .3s ease',
          color: colores.texto,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 76 }, gap: 2 }}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', mr: 2 }} aria-label="Travesía, inicio">
              <Logo claro={transparente} size={36} />
            </Box>

            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
              {enlaces.map((e) => (
                <Button
                  key={e.to}
                  component={NavLink}
                  to={e.to}
                  sx={{
                    color: colorEnlace,
                    fontWeight: 600,
                    '&.active': { color: transparente ? '#fff' : colores.oceano, bgcolor: transparente ? 'rgba(255,255,255,.12)' : 'rgba(14,94,111,.08)' },
                  }}
                >
                  {e.label}
                </Button>
              ))}
            </Stack>
            <Box sx={{ flexGrow: 1, display: { md: 'none' } }} />

            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {!autenticado && (
                <Button component={RouterLink} to="/login" sx={{ color: colorEnlace }}>
                  Iniciar sesión
                </Button>
              )}
              <Button component={RouterLink} to="/reservar" variant="contained" color="secondary">
                Reservar ahora
              </Button>
              {autenticado && (
                <IconButton onClick={(e) => setAnclaMenu(e.currentTarget)} aria-label="Menú de usuario" sx={{ p: 0.5 }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: colores.oceano, fontSize: '0.9rem', fontWeight: 700 }}>
                    {iniciales(usuario?.Nombre)}
                  </Avatar>
                </IconButton>
              )}
            </Stack>

            <IconButton
              sx={{ display: { md: 'none' }, color: transparente ? '#fff' : colores.tinta }}
              onClick={() => setDrawer(true)}
              aria-label="Abrir menú"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anclaMenu}
        open={Boolean(anclaMenu)}
        onClose={() => setAnclaMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 240, borderRadius: 3, border: `1px solid ${colores.borde}` } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>{usuario?.Nombre}</Typography>
          <Typography variant="body2" color="text.secondary">{usuario?.Correo}</Typography>
        </Box>
        <Divider />
        <MenuItem component={RouterLink} to="/mis-reservas" onClick={() => setAnclaMenu(null)}>
          <ListItemIcon><ConfirmationNumberRoundedIcon fontSize="small" /></ListItemIcon>
          Mis reservas
        </MenuItem>
        {esAdmin && (
          <MenuItem component={RouterLink} to="/admin" onClick={() => setAnclaMenu(null)}>
            <ListItemIcon><DashboardRoundedIcon fontSize="small" /></ListItemIcon>
            Panel de administración
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={salir}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>

      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <Box sx={{ width: 290, p: 2.5 }} role="presentation">
          <Logo />
          {autenticado && (
            <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: colores.arena }}>
              <Typography sx={{ fontWeight: 700 }}>{usuario?.Nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{usuario?.Correo}</Typography>
            </Box>
          )}
          <List sx={{ mt: 2 }}>
            {enlaces.map((e) => (
              <ListItemButton key={e.to} component={RouterLink} to={e.to} onClick={() => setDrawer(false)} sx={{ borderRadius: 2 }}>
                <ListItemText primary={e.label} />
              </ListItemButton>
            ))}
            {autenticado && (
              <ListItemButton component={RouterLink} to="/mis-reservas" onClick={() => setDrawer(false)} sx={{ borderRadius: 2 }}>
                <ListItemText primary="Mis reservas" />
              </ListItemButton>
            )}
            {esAdmin && (
              <ListItemButton component={RouterLink} to="/admin" onClick={() => setDrawer(false)} sx={{ borderRadius: 2 }}>
                <ListItemText primary="Panel de administración" />
              </ListItemButton>
            )}
          </List>
          <Stack spacing={1.25} sx={{ mt: 2 }}>
            <Button component={RouterLink} to="/reservar" variant="contained" color="secondary" onClick={() => setDrawer(false)}>
              Reservar ahora
            </Button>
            {autenticado ? (
              <Button variant="outlined" onClick={salir} startIcon={<LogoutRoundedIcon />}>Cerrar sesión</Button>
            ) : (
              <Button component={RouterLink} to="/login" variant="outlined" onClick={() => setDrawer(false)}>
                Iniciar sesión
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
