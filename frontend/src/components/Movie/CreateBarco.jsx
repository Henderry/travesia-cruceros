import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BarcoService from '../../services/BarcoService'; // Ajusta la ruta según tu proyecto
import HabitacionService from '../../services/HabitacionService'; // Ajusta la ruta según tu proyecto
import toast from 'react-hot-toast';

export function CreateBarco() {
  const navigate = useNavigate();
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);

  // Esquema de validación con Yup
  const barcoSchema = yup.object({
    Nombre: yup
      .string()
      .required('El nombre es requerido')
      .min(3, 'Mínimo 3 caracteres'),
    Descripcion: yup
      .string()
      .required('La descripción es requerida')
      .min(5, 'Mínimo 5 caracteres'),
    Capacidad: yup
      .number()
      .typeError('Debe ser un número')
      .required('Campo requerido')
      .positive('Debe ser positivo')
      .integer('Debe ser un número entero'),
    habitaciones: yup
      .array()
      .of(
        yup.object({
          IdHabitacion: yup
            .number()
            .required('Seleccione un tipo de habitación')
            .positive()
            .integer(),
          CantDisponible: yup
            .number()
            .required('Ingrese la cantidad')
            .positive('Debe ser positivo')
            .integer('Debe ser un número entero'),
        })
      )
      .min(1, 'Debe agregar al menos una habitación')
      .test(
        'unique-habitacion',
        'No se pueden repetir tipos de habitación',
        (value) => {
          const ids = value.map((h) => h.IdHabitacion);
          return new Set(ids).size === ids.length;
        }
      ),
  });

  // Configuración del formulario con react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      Nombre: '',
      Descripcion: '',
      Capacidad: 0,
      habitaciones: [],
    },
    resolver: yupResolver(barcoSchema),
  });

  // Manejo de la lista de habitaciones con useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'habitaciones',
  });

  // Cargar tipos de habitaciones al montar el componente
  useEffect(() => {
    HabitacionService.getHabitacion()
      .then((response) => {
        setHabitacionesDisponibles(response.data);
      })
      .catch((err) => {
        console.error('Error al cargar habitaciones', err);
        toast.error('Error al cargar tipos de habitaciones');
      });
  }, []);

  // Función para deshabilitar opciones ya seleccionadas
  const isOptionDisabled = (habId, currentIndex) => {
    const habitaciones = watch('habitaciones') || [];
    return habitaciones.some(
      (h, index) => index !== currentIndex && h.IdHabitacion === habId
    );
  };

  // Manejo del envío del formulario
  const onSubmit = (dataForm) => {
    BarcoService.createBarco(dataForm)
      .then((response) => {
        toast.success(`Barco ${response.data.Id} creado`, {
          duration: 4000,
          position: 'top-center',
        });
        navigate('/barco-table');
      })
      .catch((err) => {
        toast.error('Error al crear barco');
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} sx={{ p: 3 }}>
        {/* Título y botón de volver */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Crear Nuevo Barco
            <Tooltip title="Volver a tabla">
              <IconButton component={Link} to="/barco-table" color="primary" sx={{ ml: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Campo Nombre */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Controller
              name="Nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre del Barco"
                  error={!!errors.Nombre}
                  helperText={errors.Nombre?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Campo Descripción */}
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

        {/* Campo Capacidad */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="Capacidad"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Capacidad (personas)"
                  type="number"
                  error={!!errors.Capacidad}
                  helperText={errors.Capacidad?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Sección de Habitaciones */}
        <Grid item xs={12}>
          <Typography variant="h6">Habitaciones</Typography>
          {fields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Controller
                    name={`habitaciones[${index}].IdHabitacion`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        error={!!errors.habitaciones?.[index]?.IdHabitacion}
                      >
                        <MenuItem value="" disabled>
                          Seleccione tipo de habitación
                        </MenuItem>
                        {habitacionesDisponibles.map((hab) => (
                          <MenuItem
                            key={hab.Id}
                            value={hab.Id}
                            disabled={isOptionDisabled(hab.Id, index)}
                          >
                            {hab.Tipo}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.habitaciones?.[index]?.IdHabitacion && (
                    <Typography color="error" variant="caption">
                      {errors.habitaciones[index].IdHabitacion.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Controller
                    name={`habitaciones[${index}].CantDisponible`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cantidad"
                        type="number"
                        error={!!errors.habitaciones?.[index]?.CantDisponible}
                        helperText={errors.habitaciones?.[index]?.CantDisponible?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => remove(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={() => append({ IdHabitacion: '', CantDisponible: 0 })}
            sx={{ mt: 1 }}
          >
            Agregar Habitación
          </Button>
          {errors.habitaciones && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.habitaciones.message}
            </Typography>
          )}
        </Grid>

        {/* Botón de Guardar */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Guardar Barco
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}