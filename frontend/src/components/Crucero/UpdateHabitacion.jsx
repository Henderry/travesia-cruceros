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
  const [currentTipo, setCurrentTipo] = useState(""); // Estado para el tipo actual
  // Esquema de validaciónvalidación
    const schema = yup.object({
      Descripcion: yup
        .string()
        .required('La descripción es requerida')
        .min(5, "Mínimo 5 caracteres"),
         MaxHuespedes: yup
                .number()
                .typeError('Debe ser un número')
                .required('Campo requerido')
                .positive('Debe ser positivo')
                .integer('Debe ser un número entero')
                .min(yup.ref('MinHuespedes'), 'Debe ser mayor o igual al mínimo de huéspedes'),
      MinHuespedes: yup
             .number()
             .typeError('Debe ser un número')
             .required('Campo requerido')
             .positive('Debe ser positivo')
             .integer('Debe ser un número entero'),
         Tamano: yup
                .number()
                .typeError('Debe ser un número')
                .required('Campo requerido')
                .positive('Debe ser positivo'),

        Tipo: yup.string().required("El tipo es requerido").test(
          "unique-tipo",
          "El tipo ya existe",
          function (value) {
            if (!value) return false; // Si el campo está vacío, falla
            if (!loadedTipos) return true; // Si los tipos no están cargados, pasa
            // Validación de unicidad excluyendo el tipo actual
            return !tiposHabitacion.some(
              (tipoItem) =>
                tipoItem.Tipo.toLowerCase() === value.toLowerCase() &&
                tipoItem.Tipo.toLowerCase() !== currentTipo.toLowerCase()
            );
          }
        ),
        // Validación personalizada: no debe existir otro registro con el mismo tipo
      
      // Puedes agregar más validaciones para otros campos si es necesario
    });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });



  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [loadedTipos, setLoadedTipos] = useState(false);
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


  // Cargar datos iniciales
  useEffect(() => {
    const loadHabitacion = async () => {
      try {
        const response = await HabitacionService.getHabitacionById(id);
        reset(response.data); // Rellenar formulario con datos existentes
        setCurrentTipo(response.data.Tipo); // Guardar el tipo actual
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
      navigate("/admin/camarotes"); // Redirigir después de actualizar
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
                value={field.value ?? ''}
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
                value={field.value ?? ''}
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
            name="MinHuespedes"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Mín. Huéspedes"
                type="number"
                fullWidth
                error={!!errors.MinHuespedes}
                helperText={errors.MinHuespedes?.message}
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
                value={field.value ?? ''}
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
                value={field.value ?? ''}
                label="Tamaño (m²)"
                type="number"
                fullWidth
                error={!!errors.Tamano}
                helperText={errors.Tamano?.message}
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