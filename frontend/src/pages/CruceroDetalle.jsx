import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box, Breadcrumbs, Button, Card, Chip, Container, Divider, Link, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DirectionsBoatRoundedIcon from '@mui/icons-material/DirectionsBoatRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import CruceroService from '../services/CruceroService';
import useApi from '../hooks/useApi';
import { CargandoDetalle, EstadoError } from '../components/ui/Estados';
import { crc, fechaCorta, fechaLarga, mesCorto, dia, urlImagen } from '../utils/formato';
import { colores, sombra } from '../themes/theme';

export default function CruceroDetalle() {
  const { id } = useParams();
  const { datos: c, cargando, error, recargar } = useApi(() => CruceroService.detalle(id), [id]);
  const [salidaId, setSalidaId] = useState(null);

  useEffect(() => {
    if (c?.Salidas?.length) setSalidaId(c.Salidas[0].Id);
  }, [c]);

  if (cargando) return <Container maxWidth="lg" sx={{ py: 5 }}><CargandoDetalle /></Container>;
  if (error) return <Container maxWidth="lg" sx={{ py: 5 }}><EstadoError mensaje={error} onReintentar={recargar} /></Container>;

  const salida = c.Salidas.find((s) => s.Id === salidaId) || c.Salidas[0];
  const paises = [...new Set(c.Itinerario.map((i) => i.Pais))];

  return (
    <>
      <Box sx={{ position: 'relative', height: { xs: 340, md: 460 }, color: '#fff' }}>
        <Box component="img" src={urlImagen(c.Foto)} alt={c.Nombre} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,31,51,.25) 0%, rgba(11,31,51,.35) 45%, rgba(11,31,51,.85) 100%)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: { xs: 4, md: 6 } }}>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,.7)', mb: 2, '& a': { color: 'rgba(255,255,255,.85)' } }}>
            <Link component={RouterLink} to="/">Inicio</Link>
            <Link component={RouterLink} to="/cruceros">Cruceros</Link>
            <Typography sx={{ color: '#fff' }} variant="body2">{c.Nombre}</Typography>
          </Breadcrumbs>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '3.6rem' } }}>{c.Nombre}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
            {paises.map((p) => <Chip key={p} label={p} size="small" sx={{ bgcolor: 'rgba(255,255,255,.16)', color: '#fff', backdropFilter: 'blur(4px)' }} />)}
            {salida && <Chip label={`${salida.CantDias} días`} size="small" sx={{ bgcolor: colores.coral, color: '#fff' }} />}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
              {[
                { i: <DirectionsBoatRoundedIcon />, l: 'Barco', v: c.NombreBarco },
                { i: <GroupsRoundedIcon />, l: 'Capacidad', v: `${Number(c.Capacidad).toLocaleString('es-CR')} pasajeros` },
                { i: <CalendarMonthRoundedIcon />, l: 'Salidas', v: `${c.Salidas.length} programadas` },
              ].map((x) => (
                <Card key={x.l} sx={{ p: 2, flex: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box sx={{ color: colores.oceano, display: 'flex' }}>{x.i}</Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{x.l}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{x.v}</Typography>
                  </Box>
                </Card>
              ))}
            </Stack>

            <Typography variant="h4" sx={{ mb: 3 }}>Itinerario</Typography>
            <Box sx={{ position: 'relative', pl: 1 }}>
              {c.Itinerario.map((p, i) => (
                <Box key={p.Id} sx={{ display: 'flex', gap: 2.5, pb: i === c.Itinerario.length - 1 ? 0 : 3.5, position: 'relative' }}>
                  {i < c.Itinerario.length - 1 && (
                    <Box sx={{ position: 'absolute', left: 21, top: 44, bottom: 0, borderLeft: `2px dashed ${colores.borde}` }} />
                  )}
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center',
                    bgcolor: i === 0 || i === c.Itinerario.length - 1 ? colores.oceano : '#fff',
                    color: i === 0 || i === c.Itinerario.length - 1 ? '#fff' : colores.oceano,
                    border: `2px solid ${colores.oceano}`, fontWeight: 800, fontSize: '0.85rem', zIndex: 1,
                  }}>
                    D{p.Dia}
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, color: colores.tinta }}>{p.Puerto}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{p.Region}, {p.Pais}</Typography>
                    <Typography>{p.Descripcion}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {c.DescripcionBarco && (
              <Card sx={{ mt: 6, p: 3 }}>
                <Typography variant="overline" color="primary">A bordo</Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>{c.NombreBarco}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{c.DescripcionBarco}.</Typography>
                <Button component={RouterLink} to={`/barcos/${c.IdBarco}`} sx={{ mt: 2 }} endIcon={<ArrowForwardRoundedIcon />}>
                  Conocer el barco
                </Button>
              </Card>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4.5 }}>
            <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 100 }, boxShadow: sombra.media }}>
              {c.Salidas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <EventBusyRoundedIcon sx={{ fontSize: 44, color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>Sin salidas programadas</Typography>
                  <Typography color="text.secondary" variant="body2">Vuelva pronto: publicaremos nuevas fechas.</Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="caption" color="text.secondary">Desde</Typography>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: colores.tinta, lineHeight: 1.1 }}>{crc(c.PrecioDesde)}</Typography>
                  <Typography variant="body2" color="text.secondary">por camarote · IVA no incluido</Typography>

                  <Divider sx={{ my: 2.5 }} />
                  <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Elija su fecha de salida</Typography>
                  <Stack spacing={1}>
                    {c.Salidas.map((s) => {
                      const activa = s.Id === salida.Id;
                      return (
                        <Box
                          key={s.Id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSalidaId(s.Id)}
                          onKeyDown={(e) => e.key === 'Enter' && setSalidaId(s.Id)}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: 3, cursor: 'pointer',
                            border: `1.5px solid ${activa ? colores.oceano : colores.borde}`,
                            bgcolor: activa ? 'rgba(14,94,111,.05)' : '#fff', transition: 'all .15s',
                          }}
                        >
                          <Box sx={{ width: 48, textAlign: 'center', borderRadius: 2, bgcolor: activa ? colores.oceano : colores.arena, color: activa ? '#fff' : colores.tinta, py: 0.5 }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>{mesCorto(s.FechaSalida)}</Typography>
                            <Typography sx={{ fontSize: 19, fontWeight: 800, lineHeight: 1 }}>{dia(s.FechaSalida)}</Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{fechaCorta(s.FechaSalida)} → {fechaCorta(s.FechaRegreso)}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.CantDias} días · pago antes del {fechaCorta(s.FechaLimitePago)}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>

                  <Typography sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Tarifas para el {fechaLarga(salida.FechaSalida)}</Typography>
                  <Stack divider={<Divider flexItem />} sx={{ border: `1px solid ${colores.borde}`, borderRadius: 3 }}>
                    {salida.Tarifas.map((t) => (
                      <Box key={t.IdHabitacion} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, gap: 2 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{t.Tipo}</Typography>
                          <Stack direction="row" spacing={1.5} sx={{ color: 'text.secondary' }}>
                            <Stack direction="row" spacing={0.5} alignItems="center"><SquareFootRoundedIcon sx={{ fontSize: 15 }} /><Typography variant="caption">{t.Tamano} m²</Typography></Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center"><GroupsRoundedIcon sx={{ fontSize: 15 }} /><Typography variant="caption">Hasta {t.MaxHuespedes}</Typography></Stack>
                          </Stack>
                        </Box>
                        <Typography sx={{ fontWeight: 800, color: colores.oceano, whiteSpace: 'nowrap' }}>{crc(t.Precio)}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    fullWidth size="large" variant="contained" color="secondary" sx={{ mt: 3 }}
                    component={RouterLink} to={`/reservar?crucero=${c.Id}&salida=${salida.Id}`}
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    Reservar esta salida
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
                    Verá el total con IVA antes de confirmar.
                  </Typography>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
