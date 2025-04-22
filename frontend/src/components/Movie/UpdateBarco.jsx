import React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextField, Button, Grid, Typography, IconButton, Tooltip, FormControl, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import BarcoService from "../../services/BarcoService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HabitacionService from "../../services/HabitacionService";
import DeleteIcon from '@mui/icons-material/Delete';

export function UpdateBarco() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(barcoSchema),
    
  });
  const { fields, append, remove } = useFieldArray({
      control,
      name: 'habitaciones',
    });
      
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

      const isOptionDisabled = (habId, currentIndex) => {
        const habitaciones = watch('habitaciones') || [];
        return habitaciones.some(
          (h, index) => index !== currentIndex && h.IdHabitacion === habId
        );
      };
    

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
      console.log(data)
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
            defaultValue=""
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
            defaultValue=""
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
            defaultValue={0}
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