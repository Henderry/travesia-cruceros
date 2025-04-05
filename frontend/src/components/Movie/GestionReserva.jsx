import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Stepper,
  Step,
  StepLabel,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Card,
  CardContent,
  Paper,
  TableContainer,
  Divider,
  Box,
} from "@mui/material";
import ReservaService from "../../services/ReservaService";
import toast from "react-hot-toast";
import CruceroService from "../../services/CruceroService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ComplementoService from "../../services/ComplementoService";

const steps = [
  "Selección de Crucero",
  "Habitaciones y Pasajeros",
  "Selección de Habitaciones",
  "Información de Huéspedes",
  "Complementos",
  "Pago",
];

const schema = yup.object().shape({
  crucero: yup
    .number()
    .when("$activeStep", (activeStep, schema) =>
      activeStep >= 0 ? schema.required("Seleccione un crucero") : schema
    ),
  fecha: yup
    .string()
    .when("$activeStep", (activeStep, schema) =>
      activeStep >= 0 ? schema.required("Seleccione una fecha") : schema
    ),
  habitaciones: yup
    .array()
    .of(
      yup.object().shape({
        tipo: yup.string()  // Añadir validación para tipo
        .when('$activeStep', (activeStep, schema) => 
          activeStep >= 2 ? schema.required('Tipo de habitación requerido') : schema
        ),
        huespedes: yup
          .array()
          .of(
            yup.object().shape({
              nombre: yup
                .string()
                .when("$activeStep", (activeStep, schema) =>
                  activeStep >= 3
                    ? schema.required("Nombre es requerido")
                    : schema
                ),
              email: yup
                .string()
                .when("$activeStep", (activeStep, schema) =>
                  activeStep >= 3
                    ? schema
                        .email("Email inválido")
                        .required("Email es requerido")
                    : schema
                ),
              telefono: yup
                .string()
                .when("$activeStep", (activeStep, schema) =>
                  activeStep >= 3
                    ? schema.required("Teléfono es requerido")
                    : schema
                ),
              documento: yup
                .string()
                .when("$activeStep", (activeStep, schema) =>
                  activeStep >= 3
                    ? schema.required("Documento es requerido")
                    : schema
                ),
              fechaNacimiento: yup
                .date()
                .when("$activeStep", (activeStep, schema) =>
                  activeStep >= 3
                    ? schema
                        .required("Fecha de nacimiento es requerida")
                        .max(new Date(), "Fecha no puede ser en el futuro")
                    : schema
                ),
            })
          )
          .when("$activeStep", (activeStep, schema) =>
            activeStep >= 3
              ? schema.min(1, "Al menos un huésped requerido")
              : schema
          ),
      })
    )
    .when("$activeStep", (activeStep, schema) =>
      activeStep >= 1
        ? schema.min(1, "Al menos una habitación requerida")
        : schema
    ),
  complementos: yup.object(),
  pago: yup.object().when("$activeStep", (activeStep, schema) =>
    activeStep === 5
      ? yup.object({
          tarjeta: yup
            .string()
            .required("Número de tarjeta requerido")
            .matches(/^\d{16}$/, "Debe tener 16 dígitos"),
          expiracion: yup
            .string()
            .required("Fecha de expiración requerida")
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/YY")
            .test("validez", "Fecha expirada", function (value) {
              if (!value) return false;
              const [month, year] = value.split("/");
              const expDate = new Date(`20${year}`, month - 1);
              expDate.setMonth(expDate.getMonth() + 1);
              expDate.setDate(0);
              return expDate > new Date();
            }),
          cvv: yup
            .string()
            .required("CVV requerido")
            .matches(/^\d{3,4}$/, "3 o 4 dígitos"),
          titular: yup.string().required("Nombre del titular requerido"),
          tipoPago: yup.string().required("Seleccione tipo de pago"),
        })
      : schema
  ),
});

export default function ReservaForm() {
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const forceUpdate = () => setForceUpdateKey((prev) => prev + 1);

  const [activeStep, setActiveStep] = useState(0);
  const [cruceros, setCruceros] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [complementos, setComplementos] = useState([]);
  const [loading, setLoading] = useState(false);
  const validateCardAPI = async (cardData) => {
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validar con algoritmo de Luhn
    const cleanedNumber = cardData.tarjeta.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const [month, year] = cardData.expiracion.split("/");
    return (
      sum % 10 === 0 &&
      (parseInt(year) > currentYear ||
        (parseInt(year) === currentYear && parseInt(month) >= currentMonth))
    );
  };

  // Mock user data temporal
  const user = {
    id: 1,
    name: "Usuario Demo",
    email: "demo@example.com",
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      habitaciones: [{ tipo: "", pasajeros: 1, huespedes: [] }],
      complementos: {},
      pago: {
        tipoPago: "total",
        tarjeta: "",
        expiracion: "",
        cvv: "",
        titular: "",
      },
    },
    context: { activeStep },
  });

  const selectedCrucero = cruceros.find((c) => c.Id === watch("crucero"));
  const selectedFecha = fechas.find((f) => f.Id === watch("fecha"));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "habitaciones",
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchCruceros();
    fetchComplementos();
  }, []);

  const fetchCruceros = async () => {
    try {
      const response = await CruceroService.getCruceros();
      setCruceros(response.data);
    } catch (error) {
      toast.error("Error cargando cruceros");
    }
  };

  const fetchComplementos = async () => {
    try {
      const resp = await ComplementoService.getComplementos();
      const apiData = resp.data;
      const lista = apiData.map((c) => ({
        id: Number(c.Id),
        descripcion: c.Descripcion,
        precioBase: parseFloat(c.Precio),
        precioAplicado: parseFloat(c.PrecioAplicado),
        aplicaA: c.Id === 1 ? "habitación" : "pasajero",
      }));
      setComplementos(lista);
    } catch (err) {
      console.error("Error cargando complementos:", err);
      toast.error("Error cargando complementos");
    }
  };

  const handleCruceroChange = async (cruceroId) => {
    try {
      const response = await CruceroService.getFechasCruceroById(cruceroId);
      setFechas(response.data);
      setValue("fecha", "");
    } catch (error) {
      toast.error("Error cargando fechas");
    }
  };

  const handleFechaChange = async (fechaId) => {
    const cruceroId = watch("crucero");
    if (!cruceroId) {
      toast.error("Primero selecciona un crucero");
      return;
    }
    try {
      const { data: fechasData } =
        await CruceroService.getFechasCruceroById(cruceroId);
      setFechas(fechasData);
      const fechaObj = fechasData.find((f) => f.Id === fechaId);
      if (fechaObj?.precio_habitacion_crucero) {
        const rooms = fechaObj.precio_habitacion_crucero.map((ph) => ({
          Id: ph.IdHabitacion,
          Tipo: ph.TipoHabitacion,
          Precio: parseFloat(ph.Precio),
        }));
        setHabitacionesDisponibles(rooms);
      } else {
        setHabitacionesDisponibles([]);
      }
    } catch {
      toast.error("Error cargando habitaciones");
    }
  };

  const habitacionesArray = watch("habitaciones") || [];
  const rawComp = watch("complementos") || {};
  const complementosArray = Object.entries(rawComp)
    .map(([id, { cantidad }]) => ({ id: Number(id), cantidad }))
    .filter((c) => c.cantidad > 0);

  const selectedRooms = habitacionesArray
    .map((h) => ({
      ...h,
      detalles: habitacionesDisponibles.find((r) => r.Id === h.tipo),
    }))
    .filter((h) => h.detalles);

  const calcularTotalHabitaciones = () => {
    return selectedRooms.reduce((sum, h) => sum + (h.detalles?.Precio || 0), 0);
  };

  const calcularTotalComplementos = () => {
    return complementosArray.reduce((sum, c) => {
      const info = complementos.find((x) => x.id === c.id);
      if (!info) return sum;
      if (info.aplicaA === "habitación") {
        return sum + info.precioAplicado * selectedRooms.length * c.cantidad;
      } else {
        const totalPasajeros = selectedRooms.reduce(
          (sum, h) => sum + (h.pasajeros || 0),
          0
        );
        return sum + info.precioAplicado * totalPasajeros * c.cantidad;
      }
    }, 0);
  };

  const calcularSubtotal = () => {
    return calcularTotalHabitaciones() + calcularTotalComplementos();
  };

  const calcularImpuestos = () => {
    return calcularSubtotal() * 0.13;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuestos();
  };

  // Modifica el handleNext:
  const handleNext = async () => {
    const isValid = await trigger(); // Validar todos los campos del paso actual

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleSubmitReserva = async (data) => {
    if (activeStep !== steps.length - 1) return;
    setLoading(true);
    try {
      const isCardValid = await validateCardAPI(data.pago);
      if (!isCardValid) {
        toast.error("Tarjeta inválida. Verifique los datos");
        return;
      }

      const precioTotal = calcularTotal().toFixed(2);
      const payload = {
        IdUsuario: parseInt(user.id, 10),
        IdCrucero: parseInt(data.crucero, 10),
        IdFechaCrucero: parseInt(data.fecha, 10),
        PrecioFinal: parseFloat(precioTotal), // Asegurar 2 decimales
        Habitaciones: selectedRooms.map((room) => ({
          IdHabitacion: parseInt(room.tipo, 10),
          CantPasajeros: parseInt(room.pasajeros, 10),
        })),
        Complementos: complementosArray.map((comp) => ({
          IdComplemento: parseInt(comp.id, 10),
          Cantidad: parseInt(comp.cantidad, 10),
        })),
      };
      const reservaResponse = await ReservaService.createReserva(payload);
      const idReserva = reservaResponse.data.Id;

      if (data.pago.tipoPago === "total") {
        await ReservaService.registrarPagoCompleto(idReserva);
      }

      toast.success("Reserva y pago registrados exitosamente!");
    } catch (error) {
      console.error("Error creando reserva:", error);
      toast.error("Error creando reserva. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.crucero}>
                <InputLabel>Crucero</InputLabel>
                <Controller
                  name="crucero"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Crucero"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleCruceroChange(e.target.value);
                      }}
                    >
                      {cruceros.map((crucero) => (
                        <MenuItem key={crucero.Id} value={crucero.Id}>
                          {crucero.Nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.crucero && (
                  <Typography color="error" variant="caption">
                    {errors.crucero.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.fecha}>
                <InputLabel>Fecha de salida</InputLabel>
                <Controller
                  name="fecha"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Fecha de salida"
                      disabled={!watch("crucero")}
                      onChange={(e) => {
                        const fid = e.target.value;
                        field.onChange(fid);
                        handleFechaChange(fid);
                      }}
                    >
                      {fechas.map((f) => (
                        <MenuItem key={f.Id} value={f.Id}>
                          {format(new Date(f.FechaSalida), "PPP", {
                            locale: es,
                          })}{" "}
                          - {f.CantDias} días
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.fecha && (
                  <Typography color="error" variant="caption">
                    {errors.fecha.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            {fields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} md={4}>
                      <Controller
                        key={field.id}
                        name={`habitaciones[${index}].pasajeros`}
                        control={control}
                        render={({ field: controllerField }) => (
                          <TextField
                            {...controllerField}
                            label="Pasajeros"
                            type="number"
                            inputProps={{ min: 1, max: 4 }}
                            onChange={async (e) => {
                              const newValue = Math.max(
                                1,
                                Math.min(4, parseInt(e.target.value) || 1)
                              );
                              const currentData = getValues(
                                `habitaciones.${index}`
                              );

                              // Crear nuevos huéspedes manteniendo datos existentes
                              const newHuespedes = Array.from(
                                { length: newValue },
                                (_, i) => currentData.huespedes?.[i] || {}
                              );

                              // Actualizar todo el objeto de habitación
                              setValue(
                                `habitaciones.${index}`,
                                {
                                  ...currentData,
                                  pasajeros: newValue,
                                  huespedes: newHuespedes,
                                },
                                { shouldValidate: true, shouldDirty: true }
                              );

                              // Forzar actualización visual inmediata
                              await trigger(`habitaciones.${index}`);
                              forceUpdate();
                            }}
                            value={getValues(`habitaciones.${index}.pasajeros`)} // Valor controlado
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        fullWidth
                      >
                        Eliminar Habitación
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() =>
                  append({ pasajeros: 1, tipo: "", huespedes: [] })
                }
                fullWidth
              >
                Agregar Habitación
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            {fields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Habitación {index + 1}
                  </Typography>
                  <FormControl
                    fullWidth
                    error={!!errors.habitaciones?.[index]?.tipo}
                  >
                    <InputLabel>Tipo de Habitación</InputLabel>
                    <Controller
  name={`habitaciones[${index}].tipo`}
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      value={field.value || ""}
      error={!!errors.habitaciones?.[index]?.tipo}
      displayEmpty
      renderValue={() => {
        const selected = habitacionesDisponibles.find(h => h.Id === field.value);
        return selected?.Tipo || "Seleccione habitación";
      }}
    >
      {habitacionesDisponibles.map((h) => (
        <MenuItem key={h.Id} value={h.Id}>
          {h.Tipo} (${h.Precio.toFixed(2)})
        </MenuItem>
      ))}
    </Select>
  )}
/>
                    {errors.habitaciones?.[index]?.tipo && (
                      <Typography color="error" variant="caption">
                        {errors.habitaciones?.[index]?.tipo.message}
                      </Typography>
                    )}
                  </FormControl>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            {fields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Habitación {index + 1} 
                  </Typography>
                  {Array.from({
                    length: getValues(`habitaciones.${index}.pasajeros`),
                  }).map((_, pIndex) => (
                    <Box
                      key={pIndex}
                      sx={{
                        mb: 3,
                        p: 2,
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Huésped {pIndex + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`habitaciones[${index}].huespedes[${pIndex}].nombre`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Nombre completo"
                                fullWidth
                                error={
                                  !!errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.nombre
                                }
                                helperText={
                                  errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.nombre?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`habitaciones[${index}].huespedes[${pIndex}].email`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                error={
                                  !!errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.email
                                }
                                helperText={
                                  errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.email?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`habitaciones[${index}].huespedes[${pIndex}].telefono`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Teléfono"
                                fullWidth
                                error={
                                  !!errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.telefono
                                }
                                helperText={
                                  errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.telefono?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`habitaciones[${index}].huespedes[${pIndex}].documento`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Documento de identidad"
                                fullWidth
                                error={
                                  !!errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.documento
                                }
                                helperText={
                                  errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.documento?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`habitaciones[${index}].huespedes[${pIndex}].fechaNacimiento`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Fecha de nacimiento"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={
                                  !!errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.fechaNacimiento
                                }
                                helperText={
                                  errors.habitaciones?.[index]?.huespedes?.[
                                    pIndex
                                  ]?.fechaNacimiento?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            {complementos.map((comp) => (
              <Grid item xs={12} key={comp.id}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">
                        {comp.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precio unidad: ${comp.precioAplicado.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name={`complementos.${comp.id}.cantidad`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Cantidad"
                            fullWidth
                            inputProps={{ min: 0, max: 10 }}
                            onChange={(e) =>
                              field.onChange(Math.max(0, +e.target.value))
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1">
                        Total: $
                        {(
                          comp.precioAplicado *
                          (watch(`complementos.${comp.id}.cantidad`) || 0)
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={3}>
    
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Método de Pago
                </Typography>
                <FormControl fullWidth error={!!errors.pago?.tipoPago}>
                  <InputLabel>Tipo de Pago</InputLabel>
                  <Controller
                    name="pago.tipoPago"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Tipo de Pago">
                        <MenuItem value="total">
                          Pago Total (${calcularTotal().toFixed(2)})
                        </MenuItem>
                        <MenuItem value="deposito">
                          Depósito (${(calcularTotal() * 0.3).toFixed(2)})
                        </MenuItem>
                      </Select>
                    )}
                  />
                  {errors.pago?.tipoPago && (
                    <Typography color="error" variant="caption">
                      {errors.pago.tipoPago.message}
                    </Typography>
                  )}
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Datos de Tarjeta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="pago.tarjeta"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Número de Tarjeta"
                          fullWidth
                          placeholder="1234 5678 9012 3456"
                          error={!!errors.pago?.tarjeta}
                          helperText={errors.pago?.tarjeta?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="pago.expiracion"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Fecha de Expiración (MM/YY)"
                          fullWidth
                          placeholder="MM/YY"
                          error={!!errors.pago?.expiracion}
                          helperText={errors.pago?.expiracion?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="pago.cvv"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="CVV"
                          fullWidth
                          type="password"
                          error={!!errors.pago?.cvv}
                          helperText={errors.pago?.cvv?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="pago.titular"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nombre del Titular"
                          fullWidth
                          error={!!errors.pago?.titular}
                          helperText={errors.pago?.titular?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        );
      default:
        return <Typography>Paso desconocido</Typography>;
    }
  };
  const renderResumen = () => {
    if (!selectedCrucero || !selectedFecha) return null;

    const fechaSalida = new Date(selectedFecha.FechaSalida);
    const fechaRegreso = new Date(fechaSalida);
    fechaRegreso.setDate(fechaSalida.getDate() + selectedFecha.CantDias);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumen de la Reserva
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            {selectedCrucero.Nombre}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Fecha de Salida:</strong>
                  </TableCell>
                  <TableCell>
                    {format(fechaSalida, "PPP", { locale: es })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Fecha de Regreso:</strong>
                  </TableCell>
                  <TableCell>
                    {format(fechaRegreso, "PPP", { locale: es })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Duración:</strong>
                  </TableCell>
                  <TableCell>{selectedFecha.CantDias} días</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Habitaciones:
                    </Typography>
                  </TableCell>
                </TableRow>

                {selectedRooms.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ pl: 4 }}>
                      Habitación {index + 1}: {room.detalles?.Tipo}
                    </TableCell>
                    <TableCell>
                      {room.pasajeros} pasajero(s) - ${room.detalles.Precio}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell>
                    <strong>Total Habitaciones:</strong>
                  </TableCell>
                  <TableCell>
                    ${calcularTotalHabitaciones().toFixed(2)}
                  </TableCell>
                </TableRow>

                {complementosArray.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                          Complementos:
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {complementosArray.map((comp) => {
                      const info = complementos.find((c) => c.id === comp.id);
                      if (!info) return null;

                      return (
                        <TableRow key={comp.id}>
                          <TableCell sx={{ pl: 4 }}>
                            {info.descripcion}
                          </TableCell>
                          <TableCell>
                            {comp.cantidad} x ${info.precioAplicado.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    <TableRow>
                      <TableCell>
                        <strong>Total Complementos:</strong>
                      </TableCell>
                      <TableCell>
                        ${calcularTotalComplementos().toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </>
                )}

                <TableRow>
                  <TableCell>
                    <strong>Subtotal:</strong>
                  </TableCell>
                  <TableCell>${calcularSubtotal().toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Impuestos (13%):</strong>
                  </TableCell>
                  <TableCell>${calcularImpuestos().toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Total a Pagar:</strong>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">
                      ${calcularTotal().toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container key={forceUpdateKey} spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>

      <Grid item xs={12} md={8}>
        <form onSubmit={handleSubmit(handleSubmitReserva)}>
          {renderStepContent(activeStep)}

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              Anterior
            </Button>

            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? null : handleNext}
              type={activeStep === steps.length - 1 ? "submit" : "button"}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : activeStep === steps.length - 1
                  ? "Confirmar Reserva"
                  : "Siguiente"}
            </Button>
          </Grid>
        </form>
      </Grid>

      <Grid item xs={12} md={4}>
        {renderResumen()}
      </Grid>
    </Grid>
  );
}
