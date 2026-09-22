

import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CruceroService from "../../services/CruceroService";
import BarcoService from "../../services/BarcoService";
import toast from "react-hot-toast";
import { mensajeError } from "../../utils/formato";
import ImageService from "../../services/ImageService";

export function UpdateCrucero() {const navigate = useNavigate();
  const [barcos, setBarcos] = useState([]);
  const [puertos, setPuertos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const { id } = useParams();
  const [, setError] = useState(null);
  // Esquema de validación con Yup
  const cruceroSchema = yup.object({
    Nombre: yup.string().required("El nombre es requerido"),
    Dias: yup
      .number()
      .typeError("Debe ser un número")
      .required("La cantidad de días es requerida")
      .positive("Debe ser positivo")
      .integer("Debe ser un número entero"),
    IdBarco: yup
      .number()
      .required("Seleccione un barco")
      .typeError("Seleccione un barco"),

    itinerario: yup
      .array()
      .of(
        yup.object({
          Dia: yup
            .number()
            .min(1, "Día mínimo es 1"),
          IdPuerto: yup.number().required("Seleccione un puerto"),
          Descripcion: yup.string().required("La descripción es obligatoria"),
        })
      )
      .min(2, "Debe agregar al menos 2 puertos")
     ,

    fechas: yup
      .array()
      .of(
        yup.object({
          FechaSalida: yup
            .string()
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              "Formato de fecha inválido (YYYY-MM-DD)"
            )
            .required("Fecha de salida requerida"),
          FechaLimitePago: yup
            .string()
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              "Formato de fecha inválido (YYYY-MM-DD)"
            )
            .required("Fecha límite de pago requerida"),
          Precios: yup
            .array()
            .of(
              yup.object({
                IdHabitacion: yup.number().required("Seleccione habitación").typeError("Debe Seleccionar un puerto"),
                Precio: yup
                  .number()
                  .typeError("Debe ser un número")
                  .required("Precio requerido")
                  .positive("Debe ser positivo"),
              })
            )
            .min(1, "Debe registrar Precios de habitaciones")
            .test(
              "unique-habitaciones",
              "Las habitaciones no deben repetirse en una misma fecha",
              (value) => {
                const ids = value.map((p) => p.IdHabitacion);
                return new Set(ids).size === ids.length;
              }
            ),
        })
      )
      .min(1, "Debe registrar al menos una fecha")
      .test(
        "unique-fechas",
        "Las fechas de salida no deben repetirse",
        (value) => {
          const fechasSalida = value.map((f) => f.FechaSalida);
          return new Set(fechasSalida).size === fechasSalida.length;
        }
      ),
  });

  // Configuración del formulario con react-hook-form
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      Nombre: "",
      Foto: "",

      IdBarco: "",
        itinerario: [{ Fecha: 1, IdPuerto: "", Descripcion: "" }],
      fechas: [],
    },
    resolver: yupResolver(cruceroSchema),
  });

  // Manejo de la lista de itinerario
  const {
    fields: itinerarioFields,
    append: appendItinerario,
    remove: removeItinerario,
  } = useFieldArray({
    control,
    name: "itinerario",
  });

  // Manejo de la lista de fechas
  const {
    fields: fechaFields,
    append: appendFecha,
    remove: removeFecha,
  } = useFieldArray({
    control,
    name: "fechas",
  });

  // Cargar datos iniciales: barcos y puertos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [barcosRes, puertosRes] = await Promise.all([
          BarcoService.getBarcos(),
          CruceroService.getPuertos(),
        ]);
        setBarcos(barcosRes.data);
        setPuertos(puertosRes.data);
      } catch (error) {
        toast.error("Error cargando datos iniciales");
        console.error("Error:", error);
      }
    };
    loadData();
  }, []);

  // Cargar habitaciones del barco seleccionado
  const watchIdBarco = watch("IdBarco");
  useEffect(() => {
    const loadHabitaciones = async () => {
      if (watchIdBarco) {
        try {
          const habitacionesRes =
            await BarcoService.getListaHabitacionesByBarco(watchIdBarco);
          setHabitaciones(habitacionesRes.data);
        } catch (error) {
          toast.error("Error cargando habitaciones");
          console.error("Error:", error);
        }
      } else {
        setHabitaciones([]);
      }
    };
    loadHabitaciones();
  }, [watchIdBarco]);


  useEffect(() => {
    const loadCrucero = async () => {
      try {

        const response = await CruceroService.getUpdate(id);
              if (response.data.itinerario && response.data.itinerario.length) {
          response.data.Dias = response.data.itinerario.length;
        }
        
        reset(response.data); // Rellenar formulario con datos existentes
      } catch (error) {
        setError(error);
        toast.error("Error cargando barco");
      }
    };
    loadCrucero();
  }, [id, reset]);

  
  // Función para formatear la fecha a ISO (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return null;
    return date.toISOString().split("T")[0];
  };

  // Manejo del envío del formulario
  const onSubmit = (dataForm) => {
    const payload = {
      Id: id,
      Nombre: dataForm.Nombre,
      IdBarco: dataForm.IdBarco,
      itinerario: dataForm.itinerario.map((item) => ({
        IdPuerto: item.IdPuerto,
        Descripcion: item.Descripcion,
        Fecha: item.Fecha,
      })),
      fechas: dataForm.fechas.map((f) => {
        const fechaSalida = formatDate(f.FechaSalida);
        const fechaLimitePago = formatDate(f.FechaLimitePago);
        if (!fechaSalida || !fechaLimitePago) {
          toast.error("Formato de fecha inválido");
          throw new Error("Fecha inválida");
        }
        return {
          FechaSalida: fechaSalida,
          FechaLimitePago: fechaLimitePago,
          CantDias: f.CantDias,
          Precios: f.Precios.map((Precio) => ({
            IdHabitacion: Precio.IdHabitacion,
            Precio: Number(Precio.Precio),
          })),
        };
      }),
    };
  
    // Primero se guardan los datos; si se eligió una imagen nueva, se sube después
    CruceroService.updateCrucero(payload)
      .then(() => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("Id_Crucero", id);
        return ImageService.createImage(formData);
      })
      .then(() => {
        toast.success("Crucero actualizado");
        navigate("/admin/cruceros");
      })
      .catch((error) => {
        toast.error(mensajeError(error, "Error al actualizar el crucero"));
      });
  };
  // Función para deshabilitar puertos ya seleccionados en el itinerario
  const isPuertoDisabled = (puertoId, currentIndex) => {
    const itinerario = watch("itinerario") || [];
    const currentDia = itinerario[currentIndex]?.Fecha;
    return itinerario.some(
      (it, index) =>
        index !== currentIndex &&
        it.Fecha === currentDia &&
        it.IdPuerto === puertoId
    );
  };

  const [file,setFile]=useState(null)
  const [fileURL, setFileURL]=useState(null)
  function handleChangeImage(e){
    if(e.target.files){
      setFileURL(
        URL.createObjectURL(e.target.files[0],e.target.files[0].name)
      )
      setFile(e.target.files[0],e.target.files[0].name)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2} sx={{ p: 3 }}>
        {/* Título y botón de volver */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Editar crucero
            <Tooltip title="Volver a tabla">
              <IconButton
                component={Link}
                to="/crucero-table"
                color="primary"
                sx={{ ml: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>

        {/* Campos básicos */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Controller
              name="Nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label="Nombre del Crucero"
                  error={!!errors.Nombre}
                  helperText={errors.Nombre?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="Dias"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label="Cantidad de Días"
                  type="number"
                  error={!!errors.Dias}
                  helperText={errors.Dias?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Controller
              name="IdBarco"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  error={!!errors.IdBarco}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Seleccione un Barco
                  </MenuItem>
                  {barcos.map((barco) => (
                    <MenuItem key={barco.Id} value={barco.Id}>
                      {barco.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.IdBarco && (
              <Typography color="error" variant="caption">
                {errors.IdBarco.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Itinerario */}
        <Grid item xs={12}>
          <Typography variant="h6">Itinerario</Typography>
          {itinerarioFields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Controller
                    name={`itinerario[${index}].Fecha`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Día"
                        type="number"
                        error={!!errors.itinerario?.[index]?.Dia}
                        helperText={errors.itinerario?.[index]?.Dia?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Controller
                    name={`itinerario[${index}].IdPuerto`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        error={!!errors.itinerario?.[index]?.IdPuerto}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="" disabled>
                          Seleccione un Puerto
                        </MenuItem>
                        {puertos.map((puerto) => (
                          <MenuItem
                            key={puerto.Id}
                            value={puerto.Id}
                            disabled={isPuertoDisabled(puerto.Id, index)}
                          >
                            {puerto.Nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.itinerario?.[index]?.IdPuerto && (
                    <Typography color="error" variant="caption">
                      {errors.itinerario[index].IdPuerto.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Controller
                    name={`itinerario[${index}].Descripcion`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Descripción"
                        error={!!errors.itinerario?.[index]?.Descripcion}
                        helperText={
                          errors.itinerario?.[index]?.Descripcion?.message
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={1}>
                <IconButton
                  onClick={() => removeItinerario(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const currentDias = watch("Dias");
              const currentItinerario = watch("itinerario") || [];

              if (currentItinerario.length >= currentDias) {
                toast.error("No puede exceder la cantidad total de días");
                return;
              }

              appendItinerario({
                Dia: Math.min(currentItinerario.length + 1, currentDias),
                IdPuerto: "",
                Descripcion: "",
              });
            }}
            sx={{ mt: 1 }}
          >
            <AddIcon /> Agregar Puerto
          </Button>
          {errors.itinerario && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.itinerario.message}
            </Typography>
          )}
        </Grid>

        {/* Fechas y Precios */}
        <Grid item xs={12}>
          <Typography variant="h6">Fechas y Precios</Typography>
          {fechaFields.map((field, index) => (
            <Grid
              container
              spacing={2}
              key={field.id}
              sx={{ mb: 2 }}
              alignItems="center"
            >
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <Controller
                    name={`fechas[${index}].CantDias`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Duración (días)"
                        type="number"
                        error={!!errors.fechas?.[index]?.CantDias}
                        helperText={errors.fechas?.[index]?.CantDias?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Controller
                    name={`fechas[${index}].FechaSalida`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        type="date"
                        label="Fecha Salida"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.fechas?.[index]?.FechaSalida}
                        helperText={
                          errors.fechas?.[index]?.FechaSalida?.message
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Controller
                    name={`fechas[${index}].FechaLimitePago`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        type="date"
                        label="Fecha Límite Pago"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.fechas?.[index]?.FechaLimitePago}
                        helperText={
                          errors.fechas?.[index]?.FechaLimitePago?.message
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={5}>
                {habitaciones.map((hab, habIndex) => (
                  <FormControl fullWidth key={hab.Id}>
                    <Controller
                      name={`fechas[${index}].Precios[${habIndex}].Precio`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={field.value ?? ''}
                          label={`Precio ${hab.Tipo}`}
                          type="number"
                          error={
                            !!errors.fechas?.[index]?.Precios?.[habIndex]
                              ?.Precio
                          }
                          helperText={
                            errors.fechas?.[index]?.Precios?.[habIndex]?.Precio
                              ?.message
                          }
                          sx={{ mt: 1 }}
                        />
                      )}
                    />
                  </FormControl>
                ))}
              </Grid>

              <Grid item xs={1}>
                <IconButton onClick={() => removeFecha(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              if (!watchIdBarco) {
                toast.error("Seleccione un barco primero");
                return;
              }
              appendFecha({
                FechaSalida: new Date().toISOString().split("T")[0],
                FechaLimitePago: new Date(Date.now() + 7 * 86400000)
                  .toISOString()
                  .split("T")[0],
                CantDias: 1, 
                Precios: habitaciones.map((hab) => ({
                  IdHabitacion: hab.Id,
                  
                  Precio: 0,
                })),
              });
            }}
            sx={{ mt: 1 }}
          >
            <AddIcon /> Agregar Fecha
          </Button>
          {errors.fechas && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.fechas.message}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
              <FormControl variant='standard' fullWidth sx={{m:1}}>
              <input 
                    type='file' 
                    onChange={handleChangeImage} 
                    // value="" // No necesario pero puedes dejarlo vacío
                  />
              </FormControl>
              <img src={fileURL} width={300}/>
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
            Guardar Crucero
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}





