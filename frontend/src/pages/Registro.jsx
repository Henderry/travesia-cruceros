import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Alert, Box, Button, Link, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { mensajeError } from '../utils/formato';

const esquema = yup.object({
  Nombre: yup.string().trim().min(3, 'Ingrese su nombre completo').required('El nombre es obligatorio'),
  Correo: yup.string().trim().email('Ingrese un correo válido').required('El correo es obligatorio'),
  Telefono: yup.string().trim().matches(/^[0-9 +-]{8,15}$/, { message: 'Teléfono no válido', excludeEmptyString: true }),
  Pais: yup.string().trim(),
  Contrasena: yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Za-z]/, 'Debe incluir letras')
    .matches(/\d/, 'Debe incluir números')
    .required('La contraseña es obligatoria'),
  Confirmar: yup.string().oneOf([yup.ref('Contrasena')], 'Las contraseñas no coinciden').required('Confirme la contraseña'),
});

export default function Registro() {
  const { registrar, autenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(esquema),
    defaultValues: { Nombre: '', Correo: '', Telefono: '', Pais: 'Costa Rica', Contrasena: '', Confirmar: '' },
  });

  if (autenticado) return <Navigate to="/" replace />;

  const enviar = async (datos) => {
    setError('');
    try {
      // eslint-disable-next-line no-unused-vars
      const { Confirmar, ...cuenta } = datos;
      const u = await registrar(cuenta);
      toast.success(`¡Bienvenido, ${u.Nombre.split(' ')[0]}!`);
      navigate(location.state?.desde || '/', { replace: true });
    } catch (e) {
      setError(mensajeError(e, 'No se pudo crear la cuenta'));
    }
  };

  const campo = (nombre, ayuda) => ({
    ...register(nombre),
    error: !!errors[nombre],
    helperText: errors[nombre]?.message || ayuda,
    fullWidth: true,
  });

  return (
    <AuthLayout titulo="Cree su cuenta" subtitulo="Solo toma un minuto. Con su cuenta puede reservar y consultar sus viajes." imagen="pacifico-dorado.jpg">
      <Box component="form" onSubmit={handleSubmit(enviar)} noValidate>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid size={12}><TextField label="Nombre completo" autoComplete="name" {...campo('Nombre')} /></Grid>
          <Grid size={12}><TextField label="Correo electrónico" type="email" autoComplete="email" {...campo('Correo')} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="Teléfono (opcional)" autoComplete="tel" {...campo('Telefono')} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="País" autoComplete="country-name" {...campo('Pais')} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="Contraseña" type="password" autoComplete="new-password" {...campo('Contrasena', '8+ caracteres, letras y números')} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField label="Confirmar contraseña" type="password" autoComplete="new-password" {...campo('Confirmar')} /></Grid>
          <Grid size={12}>
            <Button type="submit" fullWidth size="large" variant="contained" disabled={isSubmitting} sx={{ mt: 1 }}>
              {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
        ¿Ya tiene cuenta?{' '}
        <Link component={RouterLink} to="/login" state={location.state} sx={{ fontWeight: 700 }}>Inicie sesión</Link>
      </Typography>
    </AuthLayout>
  );
}
