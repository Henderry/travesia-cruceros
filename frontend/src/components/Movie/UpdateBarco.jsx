import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function UpdateBarco() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);

  // Esquema de validación (igual que en CreateBarco pero sin defaultValues)
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
    HabitacionesDispoinbles: yup
      .number()
      .typeError('Debe ser un número')
      .required('Campo requerido')
      .positive('Debe ser positivo')
      .integer('Debe ser un número entero'),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(barcoSchema),
  });

  // Cargar datos del barco
  useEffect(() => {
    const loadBarco = async () => {
      try {
        const response = await BarcoService.getBarcoById(id);
        reset(response.data); // Rellenar formulario con datos existentes
      } catch (error) {
        setError(error);
        toast.error("Error cargando barco");
      }
    };
    loadBarco();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await BarcoService.updateBarco({ ...data, Id: id });
      toast.success("Barco actualizado correctamente");
      navigate("/barco-table");
    } catch (error) {
      toast.error("Error actualizando barco");
      console.error(error);
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Editar Barco
            <Tooltip title="Volver a tabla">
              <IconButton component={Link} to="/barco-table" color="primary" sx={{ ml: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Campo Nombre */}
        <Grid item xs={12} md={6}>
          <Controller
            name="Nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre del Barco"
                fullWidth
                error={!!errors.Nombre}
                helperText={errors.Nombre?.message}
              />
            )}
          />
        </Grid>

        {/* Campo Descripción */}
        <Grid item xs={12} md={6}>
          <Controller
            name="Descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                error={!!errors.Descripcion}
                helperText={errors.Descripcion?.message}
              />
            )}
          />
        </Grid>

        {/* Campo Capacidad */}
        <Grid item xs={12} md={4}>
          <Controller
            name="Capacidad"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Capacidad"
                type="number"
                fullWidth
                error={!!errors.Capacidad}
                helperText={errors.Capacidad?.message}
              />
            )}
          />
        </Grid>

        {/* Campo Habitaciones Disponibles */}
        <Grid item xs={12} md={4}>
          <Controller
            name="HabitacionesDispoinbles"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Habitaciones Disponibles"
                type="number"
                fullWidth
                error={!!errors.HabitacionesDispoinbles}
                helperText={errors.HabitacionesDispoinbles?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Guardar Cambios
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}