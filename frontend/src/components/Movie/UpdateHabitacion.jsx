import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import HabitacionService from "../../services/HabitacionService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

export function UpdateHabitacion() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID de la URL
  const [error, setError] = useState(null);

  // Esquema de validación
  const schema = yup.object().shape({
    Descripcion: yup.string().required("La descripción es requerida"),
    MinHusoedes: yup
      .number()
      .required("Mínimo de huéspedes es requerido")
      .positive(),
    Tamano: yup.number().required("Tamaño es requerido").positive(),
    Tipo: yup.string().required("El tipo es requerido"),
    Precio: yup.number().required("Precio es requerido").positive(),
    MaxHuespedes: yup
      .number()
      .required("Máximo de huéspedes es requerido")
      .positive(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadHabitacion = async () => {
      try {
        const response = await HabitacionService.getHabitacionById(id);
        reset(response.data); // Rellenar formulario con datos existentes
      } catch (error) {
        setError(error);
        toast.error("Error cargando habitación");
      }
    };
    loadHabitacion();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await HabitacionService.updateHabitacion({ ...data, Id: id });
      toast.success("Habitación actualizada correctamente");
      navigate("/habitacion-table"); // Redirigir después de actualizar
    } catch (error) {
      toast.error("Error actualizando habitación");
      console.error(error);
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Editar Habitación</Typography>
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="Descripcion"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
             
                fullWidth
                error={!!errors.Descripcion}
                helperText={errors.Descripcion?.message}
             
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="Tipo"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Tipo"
                fullWidth
                error={!!errors.Tipo}
                helperText={errors.Tipo?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name="MinHusoedes"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Mín. Huéspedes"
                type="number"
                fullWidth
                error={!!errors.MinHusoedes}
                helperText={errors.MinHusoedes?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name="MaxHuespedes"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Máx. Huéspedes"
                type="number"
                fullWidth
                error={!!errors.MaxHuespedes}
                helperText={errors.MaxHuespedes?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name="Tamano"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Tamaño (m²)"
                type="number"
                fullWidth
                error={!!errors.Tamano}
                helperText={errors.Tamano?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="Precio"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                label="Precio"
                type="number"
                fullWidth
                error={!!errors.Precio}
                helperText={errors.Precio?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
