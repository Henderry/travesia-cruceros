import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Alert, Box, Button, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { mensajeError } from '../utils/formato';
import { colores } from '../themes/theme';

const esquema = yup.object({
  correo: yup.string().trim().email('Ingrese un correo válido').required('El correo es obligatorio'),
  contrasena: yup.string().required('La contraseña es obligatoria'),
});

const demos = [
  { rol: 'Administrador', correo: 'admin@travesia.test', contrasena: 'Admin2026!', icono: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
  { rol: 'Cliente', correo: 'cliente@travesia.test', contrasena: 'Cliente2026!', icono: <PersonRoundedIcon fontSize="small" /> },
];

export default function Login() {
  const { login, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [ver, setVer] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(esquema),
    defaultValues: { correo: '', contrasena: '' },
  });

  if (autenticado) return <Navigate to={location.state?.desde || (esAdmin ? '/admin' : '/')} replace />;

  const enviar = async ({ correo, contrasena }) => {
    setError('');
    try {
      const u = await login(correo, contrasena);
      navigate(location.state?.desde || (u.Rol === 'Administrador' ? '/admin' : '/'), { replace: true });
    } catch (e) {
      setError(mensajeError(e, 'No se pudo iniciar sesión'));
    }
  };

  return (
    <AuthLayout titulo="Bienvenido de vuelta" subtitulo="Inicie sesión para reservar y ver sus viajes.">
      <Box component="form" onSubmit={handleSubmit(enviar)} noValidate>
        <Stack spacing={2.25}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Correo electrónico" type="email" autoComplete="email" fullWidth
            {...register('correo')} error={!!errors.correo} helperText={errors.correo?.message} />
          <TextField label="Contraseña" type={ver ? 'text' : 'password'} autoComplete="current-password" fullWidth
            {...register('contrasena')} error={!!errors.contrasena} helperText={errors.contrasena?.message}
            slotProps={{ input: { endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setVer((v) => !v)} edge="end" aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {ver ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                </IconButton>
              </InputAdornment>
            ) } }} />
          <Button type="submit" size="large" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </Stack>
      </Box>

      <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
        ¿No tiene cuenta?{' '}
        <Link component={RouterLink} to="/registro" state={location.state} sx={{ fontWeight: 700 }}>Regístrese gratis</Link>
      </Typography>

      <Divider sx={{ my: 4 }}>
        <Typography variant="caption" color="text.secondary">CUENTAS DE DEMOSTRACIÓN</Typography>
      </Divider>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        {demos.map((d) => (
          <Box key={d.rol} sx={{ flex: 1, p: 1.75, borderRadius: 3, border: `1px dashed ${colores.borde}`, bgcolor: colores.arena }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: colores.oceano, mb: 0.5 }}>
              {d.icono}<Typography sx={{ fontWeight: 700 }}>{d.rol}</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all' }}>{d.correo}</Typography>
            <Button size="small" sx={{ mt: 1, px: 0 }} onClick={() => { setValue('correo', d.correo); setValue('contrasena', d.contrasena); }}>
              Usar esta cuenta
            </Button>
          </Box>
        ))}
      </Stack>
    </AuthLayout>
  );
}
