import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { FormHelperText, Select, MenuItem, InputAdornment, Switch, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HabitacionService from '../../services/HabitacionService';
import toast from 'react-hot-toast';

export function CreateHabitacion() {
  const navigate = useNavigate();

  // Esquema de validación
  const habitacionSchema = yup.object({
    Descripcion: yup
      .string()
      .required('La descripción es requerida')
      .min(5, "Mínimo 5 caracteres"),
    MinHusoedes: yup
      .number()
      .typeError('Debe ser un número')
      .required('Campo requerido')
      .positive('Debe ser positivo')
      .integer(),
    Tipo: yup
      .string()
      .required('El tipo es requerido'),
    // Puedes agregar más validaciones para otros campos si es necesario
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      Descripcion: '',
      MinHusoedes: 1,
      MaxHuespedes: 2,
      Tamano: 15,
      Precio: 100,
      Tipo: '',
      Disponibilidad: true
    },
    resolver: yupResolver(habitacionSchema),
  });

  // Estados para datos externos
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [loadedTipos, setLoadedTipos] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tipos de habitación
  useEffect(() => {
    HabitacionService.getTiposHabitacion()
      .then((response) => {
        setTiposHabitacion(response.data);
        setLoadedTipos(true);
      })
      .catch((err) => {
        setError(err);
        setLoadedTipos(false);
      });
  }, []);

  // Submit handler
  const onSubmit = (dataForm) => {
    HabitacionService.createHabitacion(dataForm)
      .then((response) => {
        toast.success(`Habitación ${response.data.Id} creada`, {
          duration: 4000,
          position: 'top-center'
        });
        navigate('/habitacion-table');
      })
      .catch((err) => {
        toast.error('Error al crear habitación');
        console.error(err);
      });
  };

  if (error) return <p>Error: {error?.message || error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Crear Nueva Habitación
            <Tooltip title="Volver a tabla">
              <IconButton 
                component={Link} 
                to="/habitacion-table" 
                color="primary"
                sx={{ ml: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Descripción */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Controller
              name="Descripcion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  error={!!errors.Descripcion}
                  helperText={errors.Descripcion?.message}
                  multiline
                  rows={3}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Tipo de Habitación */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            {loadedTipos ? (
              <Controller
                name="Tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Habitación"
                    error={!!errors.Tipo}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Seleccione un tipo</em>
                    </MenuItem>
                    {tiposHabitacion.map((tipo, index) => (
                      <MenuItem key={index} value={tipo.Tipo}>
                        {tipo.Tipo}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            ) : (
              <Typography variant="body2">Cargando tipos...</Typography>
            )}
            <FormHelperText error>{errors.Tipo?.message}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Capacidad: Mínimo de Huéspedes */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="MinHusoedes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mínimo de Huéspedes"
                  type="number"
                  error={!!errors.MinHusoedes}
                  helperText={errors.MinHusoedes?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Capacidad: Máximo de Huéspedes */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="MaxHuespedes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Máximo de Huéspedes"
                  type="number"
                  error={!!errors.MaxHuespedes}
                  helperText={errors.MaxHuespedes?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Tamaño */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="Tamano"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tamaño (m²)"
                  type="number"
                  error={!!errors.Tamano}
                  helperText={errors.Tamano?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Precio */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="Precio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio por noche ($)"
                  type="number"
                  error={!!errors.Precio}
                  helperText={errors.Precio?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Disponibilidad */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="Disponibilidad"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Disponible"
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Guardar Habitación
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
