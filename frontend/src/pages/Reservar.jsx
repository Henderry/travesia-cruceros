import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardActionArea, Chip, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Radio, Select, Stack, Step, StepLabel, Stepper, TextField, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import toast from 'react-hot-toast';
import CruceroService from '../services/CruceroService';
import ComplementoService from '../services/ComplementoService';
import ReservaService from '../services/ReservaService';
import { useAuth } from '../context/AuthContext';
import { CargandoDetalle, EstadoError } from '../components/ui/Estados';
import { crc, dia, fechaCorta, fechaLarga, mensajeError, mesCorto, urlImagen } from '../utils/formato';
import { formatearNumero, formatearVencimiento, luhnValido, marcaTarjeta, vencimientoValido } from '../utils/tarjeta';
import { colores, sombra } from '../themes/theme';

// Estimado; el total final lo calcula el servidor.
const IVA = 13;
const pasos = ['Viaje', 'Camarotes', 'Huéspedes', 'Complementos', 'Pago'];

function Contador({ valor, min = 0, max = 10, onChange }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ border: `1px solid ${colores.borde}`, borderRadius: 999, px: 0.5 }}>
      <IconButton size="small" onClick={() => onChange(Math.max(min, valor - 1))} disabled={valor <= min} aria-label="Menos"><RemoveRoundedIcon fontSize="small" /></IconButton>
      <Typography sx={{ width: 22, textAlign: 'center', fontWeight: 700 }}>{valor}</Typography>
      <IconButton size="small" onClick={() => onChange(Math.min(max, valor + 1))} disabled={valor >= max} aria-label="Más"><AddRoundedIcon fontSize="small" /></IconButton>
    </Stack>
  );
}
Contador.propTypes = { valor: PropTypes.number.isRequired, min: PropTypes.number, max: PropTypes.number, onChange: PropTypes.func.isRequired };

export default function Reservar() {
  const { usuario } = useAuth();
  const [params] = useSearchParams();
  const [paso, setPaso] = useState(0);
  const [catalogo, setCatalogo] = useState(null);
  const [complementos, setComplementos] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [cruceroId, setCruceroId] = useState(params.get('crucero') ? Number(params.get('crucero')) : null);
  const [detalle, setDetalle] = useState(null);
  const [salidaId, setSalidaId] = useState(params.get('salida') ? Number(params.get('salida')) : null);
  const [camarotes, setCamarotes] = useState([{ tipo: '', pasajeros: 2 }]);
  const [huespedes, setHuespedes] = useState([]);
  const [extras, setExtras] = useState({});
  const [pago, setPago] = useState({ modo: 'ahora', numero: '', vence: '', cvv: '', titular: usuario?.Nombre || '' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    Promise.all([CruceroService.catalogo(), ComplementoService.getComplementos()])
      .then(([c, comp]) => {
        setCatalogo(c.data.filter((x) => x.ProximaSalida));
        setComplementos(comp.data);
      })
      .catch((e) => setErrorCarga(mensajeError(e)));
  }, []);

  useEffect(() => {
    if (!cruceroId) return;
    setDetalle(null);
    CruceroService.detalle(cruceroId)
      .then((r) => {
        setDetalle(r.data);
        setSalidaId((actual) => (r.data.Salidas.some((s) => s.Id === actual) ? actual : r.data.Salidas[0]?.Id ?? null));
      })
      .catch((e) => setErrorCarga(mensajeError(e)));
  }, [cruceroId]);

  const salida = detalle?.Salidas.find((s) => s.Id === salidaId) || null;
  const tarifas = useMemo(() => salida?.Tarifas || [], [salida]);
  const tarifa = (tipo) => tarifas.find((t) => t.IdHabitacion === tipo);

  // Mantener la lista de huéspedes alineada con los pasajeros de cada camarote
  const totalPasajeros = camarotes.reduce((s, c) => s + c.pasajeros, 0);
  useEffect(() => {
    setHuespedes((prev) => {
      const nueva = Array.from({ length: totalPasajeros }, (_, i) => prev[i] || { Nombre: '', Edad: '', Sexo: '', Telefono: '' });
      if (nueva[0] && !nueva[0].Nombre && usuario?.Nombre) nueva[0] = { ...nueva[0], Nombre: usuario.Nombre, Telefono: usuario.Telefono || '' };
      return nueva;
    });
  }, [totalPasajeros, usuario]);

  const totalCamarotes = camarotes.reduce((s, c) => s + Number(tarifa(c.tipo)?.Precio || 0), 0);
  const listaExtras = complementos.filter((c) => (extras[c.Id] || 0) > 0);
  const totalExtras = listaExtras.reduce((s, c) => s + Number(c.PrecioAplicado) * extras[c.Id], 0);
  const subtotal = totalCamarotes + totalExtras;
  const iva = Math.round(subtotal * IVA) / 100;
  const total = subtotal + iva;

  const validar = () => {
    const e = {};
    if (paso === 0) {
      if (!cruceroId) e.crucero = 'Elija un crucero';
      if (!salidaId) e.salida = 'Elija una fecha de salida';
    }
    if (paso === 1) {
      camarotes.forEach((c, i) => {
        if (!c.tipo) e[`tipo${i}`] = 'Elija el tipo de camarote';
        const t = tarifa(c.tipo);
        if (t && c.pasajeros > Number(t.MaxHuespedes)) e[`pax${i}`] = `Máximo ${t.MaxHuespedes} por camarote`;
      });
    }
    if (paso === 2) {
      huespedes.forEach((h, i) => {
        if (h.Nombre.trim().length < 3) e[`nombre${i}`] = 'Nombre requerido';
        if (h.Edad === '' || Number(h.Edad) < 0 || Number(h.Edad) > 110) e[`edad${i}`] = 'Edad no válida';
      });
    }
    if (paso === 4 && pago.modo === 'ahora') {
      if (!luhnValido(pago.numero)) e.numero = 'Número de tarjeta no válido';
      if (!vencimientoValido(pago.vence)) e.vence = 'Fecha vencida o no válida (MM/AA)';
      if (!/^\d{3,4}$/.test(pago.cvv)) e.cvv = 'CVV no válido';
      if (pago.titular.trim().length < 3) e.titular = 'Nombre del titular requerido';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const subir = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const siguiente = () => {
    if (validar()) {
      setPaso((p) => p + 1);
      subir();
    }
  };
  const anterior = () => {
    setErrores({});
    setPaso((p) => p - 1);
    subir();
  };

  const confirmar = async () => {
    if (!validar()) return;
    setEnviando(true);
    try {
      const { data } = await ReservaService.createReserva({
        IdCrucero: cruceroId,
        IdFechaCrucero: salidaId,
        Habitaciones: camarotes.map((c) => ({ IdHabitacion: c.tipo, CantPasajeros: c.pasajeros })),
        Complementos: listaExtras.map((c) => ({ IdComplemento: c.Id, Cantidad: extras[c.Id] })),
        Huespedes: huespedes.map((h) => ({ ...h, Edad: Number(h.Edad) })),
      });
      if (pago.modo === 'ahora') {
        await ReservaService.registrarPago(data.Id);
      }
      setResultado({ ...data, Pagada: pago.modo === 'ahora' });
      toast.success('¡Reserva confirmada!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(mensajeError(err, 'No se pudo completar la reserva'));
    } finally {
      setEnviando(false);
    }
  };

  if (errorCarga) return <Container maxWidth="lg" sx={{ py: 6 }}><EstadoError mensaje={errorCarga} /></Container>;
  if (!catalogo) return <Container maxWidth="lg" sx={{ py: 6 }}><CargandoDetalle /></Container>;

  if (resultado) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Card sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', boxShadow: sombra.media }}>
          <Box sx={{ width: 76, height: 76, mx: 'auto', borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(46,139,87,.12)', color: colores.exito, mb: 2 }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography variant="overline" color="text.secondary">Reserva #{resultado.Id}</Typography>
          <Typography variant="h3" sx={{ fontSize: '2.1rem', mt: 0.5 }}>¡Buen viaje, {usuario?.Nombre?.split(' ')[0]}!</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            Su crucero <b>{resultado.NombreCrucero}</b> sale el {fechaLarga(resultado.FechaSalida)} desde {resultado.PuertoSalida}.
          </Typography>
          <Box sx={{ my: 3, p: 2.5, borderRadius: 3, bgcolor: colores.arena }}>
            <Typography variant="body2" color="text.secondary">{resultado.Pagada ? 'Total pagado' : 'Total a pagar'}</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: colores.tinta }}>{crc(resultado.Total)}</Typography>
            {!resultado.Pagada && (
              <Typography variant="body2" color="text.secondary">Puede pagarlo desde «Mis reservas» antes del {fechaLarga(resultado.FechaLimitePago)}.</Typography>
            )}
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button variant="contained" component={RouterLink} to={`/reservas/${resultado.Id}`}>Ver reserva y factura</Button>
            <Button variant="outlined" component={RouterLink} to="/mis-reservas">Mis reservas</Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const resumen = (
    <Card sx={{ position: { md: 'sticky' }, top: { md: 100 }, boxShadow: sombra.media, overflow: 'hidden' }}>
      {detalle ? (
        <Box sx={{ position: 'relative', height: 130 }}>
          <Box component="img" src={urlImagen(detalle.Foto)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(11,31,51,.8))' }} />
          <Typography variant="h6" sx={{ position: 'absolute', left: 20, bottom: 14, color: '#fff' }}>{detalle.Nombre}</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2.5, bgcolor: colores.arena }}><Typography color="text.secondary">Elija un crucero para ver el resumen</Typography></Box>
      )}
      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Resumen de su reserva</Typography>
        {salida && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {fechaCorta(salida.FechaSalida)} → {fechaCorta(salida.FechaRegreso)} · {salida.CantDias} días
          </Typography>
        )}
        <Stack spacing={1}>
          {camarotes.filter((c) => c.tipo).map((c, i) => (
            <Stack key={i} direction="row" justifyContent="space-between">
              <Typography variant="body2">{tarifa(c.tipo)?.Tipo} · {c.pasajeros} pax</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{crc(tarifa(c.tipo)?.Precio)}</Typography>
            </Stack>
          ))}
          {listaExtras.map((c) => (
            <Stack key={c.Id} direction="row" justifyContent="space-between">
              <Typography variant="body2">{c.Descripcion} × {extras[c.Id]}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{crc(c.PrecioAplicado * extras[c.Id])}</Typography>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={0.75}>
          <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Subtotal</Typography><Typography variant="body2">{crc(subtotal)}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">IVA ({IVA}%)</Typography><Typography variant="body2">{crc(iva)}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.45rem', color: colores.tinta }}>{crc(total)}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' } }}>Reservar crucero</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>Complete los pasos. Verá el total con IVA antes de confirmar.</Typography>

        <Card sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
          <Stepper activeStep={paso} alternativeLabel>
            {pasos.map((p) => <Step key={p}><StepLabel>{p}</StepLabel></Step>)}
          </Stepper>
        </Card>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: { xs: 2.5, md: 4 } }}>
              {paso === 0 && (
                <>
                  <Typography variant="h5" sx={{ mb: 2.5 }}>¿Qué crucero le interesa?</Typography>
                  {errores.crucero && <Alert severity="warning" sx={{ mb: 2 }}>{errores.crucero}</Alert>}
                  <Grid container spacing={2}>
                    {catalogo.map((c) => {
                      const activo = c.Id === cruceroId;
                      return (
                        <Grid key={c.Id} size={{ xs: 12, sm: 6 }}>
                          <Card sx={{ border: `2px solid ${activo ? colores.oceano : colores.borde}`, boxShadow: activo ? sombra.media : 'none' }}>
                            <CardActionArea onClick={() => setCruceroId(c.Id)} sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-start' }}>
                              <Box component="img" src={urlImagen(c.Foto)} alt="" sx={{ width: 96, objectFit: 'cover' }} />
                              <Box sx={{ p: 1.75, flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: 700 }}>{c.Nombre}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{(c.Destinos || []).join(' · ')}</Typography>
                                <Typography variant="body2" sx={{ color: colores.oceano, fontWeight: 700, mt: 0.5 }}>Desde {crc(c.PrecioDesde)}</Typography>
                              </Box>
                              <Radio checked={activo} sx={{ alignSelf: 'center' }} />
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {cruceroId && (
                    <>
                      <Typography variant="h6" sx={{ mt: 4, mb: 1.5 }}>Fecha de salida</Typography>
                      {errores.salida && <Alert severity="warning" sx={{ mb: 2 }}>{errores.salida}</Alert>}
                      {!detalle ? <Typography color="text.secondary">Cargando fechas…</Typography> : (
                        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
                          {detalle.Salidas.map((s) => {
                            const activa = s.Id === salidaId;
                            return (
                              <Box key={s.Id} role="button" tabIndex={0} onClick={() => setSalidaId(s.Id)} onKeyDown={(e) => e.key === 'Enter' && setSalidaId(s.Id)}
                                sx={{ cursor: 'pointer', display: 'flex', gap: 1.5, alignItems: 'center', p: 1.25, pr: 2, borderRadius: 3, border: `2px solid ${activa ? colores.oceano : colores.borde}`, bgcolor: activa ? 'rgba(14,94,111,.05)' : '#fff' }}>
                                <Box sx={{ width: 46, textAlign: 'center', borderRadius: 2, bgcolor: activa ? colores.oceano : colores.arena, color: activa ? '#fff' : colores.tinta, py: 0.5 }}>
                                  <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{mesCorto(s.FechaSalida)}</Typography>
                                  <Typography sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{dia(s.FechaSalida)}</Typography>
                                </Box>
                                <Box>
                                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{fechaCorta(s.FechaSalida)}</Typography>
                                  <Typography variant="caption" color="text.secondary">{s.CantDias} días</Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </>
                  )}
                </>
              )}

              {paso === 1 && (
                <>
                  <Typography variant="h5" sx={{ mb: 1 }}>Camarotes</Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>Agregue los camarotes que necesita y cuántas personas viajan en cada uno.</Typography>
                  <Stack spacing={2}>
                    {camarotes.map((c, i) => {
                      const t = tarifa(c.tipo);
                      return (
                        <Box key={i} sx={{ p: 2, borderRadius: 3, border: `1px solid ${colores.borde}`, bgcolor: colores.arena }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 700 }}>Camarote {i + 1}</Typography>
                            {camarotes.length > 1 && (
                              <IconButton size="small" aria-label="Quitar camarote" onClick={() => setCamarotes(camarotes.filter((_, j) => j !== i))}><DeleteOutlineRoundedIcon /></IconButton>
                            )}
                          </Stack>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, sm: 7 }}>
                              <FormControl fullWidth error={!!errores[`tipo${i}`]}>
                                <InputLabel id={`tipo-${i}`}>Tipo de camarote</InputLabel>
                                <Select labelId={`tipo-${i}`} label="Tipo de camarote" value={c.tipo}
                                  onChange={(e) => setCamarotes(camarotes.map((x, j) => (j === i ? { ...x, tipo: e.target.value, pasajeros: Math.min(x.pasajeros, Number(tarifa(e.target.value)?.MaxHuespedes || 4)) } : x)))}>
                                  {tarifas.map((tf) => (
                                    <MenuItem key={tf.IdHabitacion} value={tf.IdHabitacion}>
                                      {tf.Tipo} — {crc(tf.Precio)} · hasta {tf.MaxHuespedes} personas
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errores[`tipo${i}`] && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errores[`tipo${i}`]}</Typography>}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 5 }}>
                              <Stack direction="row" alignItems="center" spacing={1.5} justifyContent={{ sm: 'flex-end' }}>
                                <Typography variant="body2" color="text.secondary">Pasajeros</Typography>
                                <Contador valor={c.pasajeros} min={1} max={Number(t?.MaxHuespedes || 4)}
                                  onChange={(v) => setCamarotes(camarotes.map((x, j) => (j === i ? { ...x, pasajeros: v } : x)))} />
                              </Stack>
                            </Grid>
                          </Grid>
                          {t && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>{t.Descripcion}</Typography>}
                        </Box>
                      );
                    })}
                  </Stack>
                  {camarotes.length < 5 && (
                    <Button startIcon={<AddRoundedIcon />} sx={{ mt: 2 }} onClick={() => setCamarotes([...camarotes, { tipo: '', pasajeros: 2 }])}>
                      Agregar otro camarote
                    </Button>
                  )}
                </>
              )}

              {paso === 2 && (
                <>
                  <Typography variant="h5" sx={{ mb: 1 }}>Huéspedes</Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>Datos de las {totalPasajeros} personas que viajan. El primer huésped es el titular.</Typography>
                  <Stack spacing={2.5}>
                    {huespedes.map((h, i) => {
                      const set = (campo, valor) => setHuespedes(huespedes.map((x, j) => (j === i ? { ...x, [campo]: valor } : x)));
                      return (
                        <Box key={i}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
                            <Typography sx={{ fontWeight: 700 }}>Huésped {i + 1}</Typography>
                            {i === 0 && <Chip size="small" label="Titular" color="primary" variant="outlined" />}
                          </Stack>
                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, sm: 5 }}><TextField fullWidth label="Nombre completo" value={h.Nombre} onChange={(e) => set('Nombre', e.target.value)} error={!!errores[`nombre${i}`]} helperText={errores[`nombre${i}`]} /></Grid>
                            <Grid size={{ xs: 4, sm: 2 }}><TextField fullWidth label="Edad" type="number" value={h.Edad} onChange={(e) => set('Edad', e.target.value)} error={!!errores[`edad${i}`]} helperText={errores[`edad${i}`]} slotProps={{ htmlInput: { min: 0, max: 110 } }} /></Grid>
                            <Grid size={{ xs: 8, sm: 2 }}>
                              <FormControl fullWidth>
                                <InputLabel id={`sx-${i}`}>Sexo</InputLabel>
                                <Select labelId={`sx-${i}`} label="Sexo" value={h.Sexo} onChange={(e) => set('Sexo', e.target.value)}>
                                  <MenuItem value="">—</MenuItem><MenuItem value="F">F</MenuItem><MenuItem value="M">M</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label="Teléfono" value={h.Telefono} onChange={(e) => set('Telefono', e.target.value)} /></Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Stack>
                </>
              )}

              {paso === 3 && (
                <>
                  <Typography variant="h5" sx={{ mb: 1 }}>Complementos</Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>Opcional. Agregue experiencias para hacer el viaje aún mejor.</Typography>
                  <Stack divider={<Divider flexItem />} sx={{ border: `1px solid ${colores.borde}`, borderRadius: 3 }}>
                    {complementos.map((c) => (
                      <Stack key={c.Id} direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ p: 2 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{c.Descripcion}</Typography>
                          <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography sx={{ color: colores.oceano, fontWeight: 700 }}>{crc(c.PrecioAplicado)}</Typography>
                            {Number(c.Precio) > Number(c.PrecioAplicado) && (
                              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>{crc(c.Precio)}</Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">por unidad</Typography>
                          </Stack>
                        </Box>
                        <Contador valor={extras[c.Id] || 0} max={20} onChange={(v) => setExtras({ ...extras, [c.Id]: v })} />
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}

              {paso === 4 && (
                <>
                  <Typography variant="h5" sx={{ mb: 2.5 }}>Pago</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { modo: 'ahora', icono: <CreditCardRoundedIcon />, titulo: 'Pagar ahora', texto: `Total ${crc(total)}` },
                      { modo: 'despues', icono: <ScheduleRoundedIcon />, titulo: 'Pagar después', texto: salida ? `Antes del ${fechaCorta(salida.FechaLimitePago)}` : '' },
                    ].map((o) => (
                      <Grid key={o.modo} size={{ xs: 12, sm: 6 }}>
                        <Card sx={{ border: `2px solid ${pago.modo === o.modo ? colores.oceano : colores.borde}`, boxShadow: 'none' }}>
                          <CardActionArea onClick={() => setPago({ ...pago, modo: o.modo })} sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', gap: 1.5 }}>
                            <Box sx={{ color: colores.oceano, display: 'flex' }}>{o.icono}</Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography sx={{ fontWeight: 700 }}>{o.titulo}</Typography>
                              <Typography variant="body2" color="text.secondary">{o.texto}</Typography>
                            </Box>
                            <Radio checked={pago.modo === o.modo} />
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {pago.modo === 'ahora' ? (
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <TextField fullWidth label="Número de tarjeta" value={pago.numero} inputMode="numeric" autoComplete="cc-number"
                          onChange={(e) => setPago({ ...pago, numero: formatearNumero(e.target.value) })}
                          error={!!errores.numero} helperText={errores.numero || marcaTarjeta(pago.numero) || 'Para probar use 4111 1111 1111 1111'} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <TextField fullWidth label="Vence (MM/AA)" value={pago.vence} autoComplete="cc-exp"
                          onChange={(e) => setPago({ ...pago, vence: formatearVencimiento(e.target.value) })}
                          error={!!errores.vence} helperText={errores.vence} />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField fullWidth label="CVV" value={pago.cvv} type="password" autoComplete="cc-csc"
                          onChange={(e) => setPago({ ...pago, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          error={!!errores.cvv} helperText={errores.cvv} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField fullWidth label="Titular" value={pago.titular} autoComplete="cc-name"
                          onChange={(e) => setPago({ ...pago, titular: e.target.value })}
                          error={!!errores.titular} helperText={errores.titular} />
                      </Grid>
                      <Grid size={12}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                          <LockRoundedIcon fontSize="small" />
                          <Typography variant="body2">La tarjeta se valida en su navegador y no se guarda en nuestros sistemas.</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info">
                      Su camarote queda reservado. Puede pagar desde <b>Mis reservas</b> antes del {salida && fechaLarga(salida.FechaLimitePago)}.
                    </Alert>
                  )}
                </>
              )}

              <Divider sx={{ my: 3 }} />
              <Stack direction="row" justifyContent="space-between">
                <Button onClick={anterior} disabled={paso === 0 || enviando}>Atrás</Button>
                {paso < pasos.length - 1 ? (
                  <Button variant="contained" onClick={siguiente}>Continuar</Button>
                ) : (
                  <Button variant="contained" color="secondary" onClick={confirmar} disabled={enviando}>
                    {enviando ? 'Procesando…' : pago.modo === 'ahora' ? `Pagar ${crc(total)}` : 'Confirmar reserva'}
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>{resumen}</Grid>
        </Grid>
      </Container>
    </Box>
  );
}
