import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, Chip, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import CruceroService from '../services/CruceroService';
import useApi from '../hooks/useApi';
import CruceroCard from '../components/ui/CruceroCard';
import { CargandoTarjetas } from '../components/ui/Estados';
import { TituloSeccion } from '../components/ui/Encabezado';
import { crc, fechaLarga, mesCorto, dia, urlImagen } from '../utils/formato';
import { parseFechaLocal } from '../utils/fechas';
import { colores, sombra } from '../themes/theme';

const beneficios = [
  { icono: <PercentRoundedIcon />, titulo: 'Precios claros', texto: 'Ve el subtotal, el IVA y el total antes de confirmar. Sin cargos escondidos.' },
  { icono: <ReceiptLongRoundedIcon />, titulo: 'Factura al instante', texto: 'Descargue su factura en PDF desde el detalle de cada reserva.' },
  { icono: <LockRoundedIcon />, titulo: 'Pago protegido', texto: 'Validamos su tarjeta al momento y nunca guardamos sus datos bancarios.' },
  { icono: <AnchorRoundedIcon />, titulo: 'Salidas desde Costa Rica', texto: 'Embarque en Limón o Guanacaste, sin vuelos de conexión.' },
];

function Hero({ cruceros }) {
  const destacado = cruceros?.find((c) => c.ProximaSalida) || null;
  const totalSalidas = (cruceros || []).reduce((s, c) => s + (c.Salidas || 0), 0);
  const paises = new Set((cruceros || []).flatMap((c) => c.Destinos || [])).size;

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background: `linear-gradient(160deg, ${colores.tinta} 0%, #0C3A4A 55%, ${colores.oceano} 100%)`,
        pt: { xs: 14, md: 18 },
        pb: { xs: 16, md: 20 },
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(58,175,169,.35) 0, transparent 38%), radial-gradient(circle at 0% 100%, rgba(224,122,95,.25) 0, transparent 30%)' }} />
      <Box aria-hidden component="svg" viewBox="0 0 1440 120" preserveAspectRatio="none" sx={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: { xs: 60, md: 110 } }}>
        <path d="M0,64 C240,112 480,16 720,48 C960,80 1200,112 1440,64 L1440,120 L0,120 Z" fill={colores.arena} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip label="Caribe · Pacífico · Canal de Panamá" sx={{ bgcolor: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.18)', mb: 3 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.1rem' } }}>
              Zarpe hacia su próxima{' '}
              <Box component="span" sx={{ color: '#FFD9B8', fontStyle: 'italic' }}>gran historia</Box>
            </Typography>
            <Typography sx={{ mt: 3, fontSize: '1.15rem', color: 'rgba(255,255,255,.78)', maxWidth: 520 }}>
              Cruceros con salida desde Costa Rica hacia las playas, ciudades coloniales y arrecifes más
              bonitos de la región. Elija su camarote, reserve en minutos y viaje tranquilo.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button component={RouterLink} to="/cruceros" size="large" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />}>
                Explorar cruceros
              </Button>
              <Button component={RouterLink} to="/barcos" size="large" sx={{ color: '#fff', border: '1px solid rgba(255,255,255,.35)', '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } }}>
                Conocer los barcos
              </Button>
            </Stack>
            {cruceros && (
              <Stack direction="row" spacing={{ xs: 3, sm: 5 }} sx={{ mt: 6 }}>
                {[
                  [cruceros.length, 'rutas'],
                  [totalSalidas, 'salidas programadas'],
                  [paises, 'países'],
                ].map(([n, l]) => (
                  <Box key={l}>
                    <Typography sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '2.2rem', fontWeight: 600, lineHeight: 1 }}>{n}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.65)', mt: 0.5 }}>{l}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'relative', height: 480 }}>
              <Box component="img" src={urlImagen('joyas-del-caribe.jpg')} alt="Cruceros atracados en aguas turquesa"
                sx={{ position: 'absolute', right: 0, top: 0, width: '82%', height: 380, objectFit: 'cover', borderRadius: 6, boxShadow: '0 30px 60px rgba(0,0,0,.35)' }} />
              <Box component="img" src={urlImagen('pacifico-dorado.jpg')} alt="Playa tropical"
                sx={{ position: 'absolute', left: 0, bottom: 0, width: '46%', height: 220, objectFit: 'cover', borderRadius: 5, border: '6px solid rgba(255,255,255,.95)', boxShadow: '0 20px 40px rgba(0,0,0,.35)' }} />
              {destacado && (
                <Card component={RouterLink} to={`/cruceros/${destacado.Id}`}
                  sx={{ position: 'absolute', right: 24, bottom: 20, p: 2, width: 250, textDecoration: 'none', boxShadow: sombra.media, border: 0 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 52, height: 56, borderRadius: 2.5, bgcolor: colores.arena, textAlign: 'center', pt: 0.75, flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: colores.coral, textTransform: 'uppercase' }}>{mesCorto(destacado.ProximaSalida)}</Typography>
                      <Typography sx={{ fontSize: 22, fontWeight: 800, color: colores.tinta, lineHeight: 1 }}>{dia(destacado.ProximaSalida)}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">Próxima salida</Typography>
                      <Typography sx={{ fontWeight: 700, color: colores.tinta }} noWrap>{destacado.Nombre}</Typography>
                      <Typography variant="body2" sx={{ color: colores.oceano, fontWeight: 700 }}>Desde {crc(destacado.PrecioDesde)}</Typography>
                    </Box>
                  </Stack>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
Hero.propTypes = { cruceros: PropTypes.array };

function Buscador({ cruceros }) {
  const navigate = useNavigate();
  const [destino, setDestino] = useState('');
  const [mes, setMes] = useState('');

  const destinos = useMemo(() => [...new Set((cruceros || []).flatMap((c) => c.Destinos || []))].sort(), [cruceros]);
  const meses = useMemo(() => {
    const set = new Map();
    (cruceros || []).forEach((c) => {
      const d = parseFechaLocal(c.ProximaSalida);
      if (d) {
        const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        set.set(clave, d.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }));
      }
    });
    return [...set.entries()].sort();
  }, [cruceros]);

  const buscar = () => {
    const q = new URLSearchParams();
    if (destino) q.set('destino', destino);
    if (mes) q.set('mes', mes);
    navigate(`/cruceros${q.toString() ? `?${q}` : ''}`);
  };

  return (
    <Container maxWidth="md" sx={{ position: 'relative', mt: { xs: -9, md: -12 }, zIndex: 2 }}>
      <Card sx={{ p: { xs: 2, md: 2.5 }, boxShadow: sombra.media, border: 0 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <FormControl fullWidth>
              <InputLabel id="b-destino">¿A dónde quiere ir?</InputLabel>
              <Select labelId="b-destino" label="¿A dónde quiere ir?" value={destino} onChange={(e) => setDestino(e.target.value)}>
                <MenuItem value="">Todos los destinos</MenuItem>
                {destinos.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="b-mes">¿Cuándo?</InputLabel>
              <Select labelId="b-mes" label="¿Cuándo?" value={mes} onChange={(e) => setMes(e.target.value)}>
                <MenuItem value="">Cualquier fecha</MenuItem>
                {meses.map(([k, l]) => <MenuItem key={k} value={k} sx={{ textTransform: 'capitalize' }}>{l}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button fullWidth size="large" variant="contained" startIcon={<SearchRoundedIcon />} onClick={buscar} sx={{ height: 56, borderRadius: 3 }}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
Buscador.propTypes = { cruceros: PropTypes.array };

export default function Home() {
  const { datos: cruceros, cargando } = useApi(() => CruceroService.catalogo(), []);
  const proximos = (cruceros || []).filter((c) => c.ProximaSalida).slice(0, 3);

  const destinos = useMemo(() => {
    const conteo = {};
    (cruceros || []).forEach((c) => (c.Destinos || []).forEach((d) => (conteo[d] = (conteo[d] || 0) + 1)));
    return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  }, [cruceros]);

  return (
    <>
      <Hero cruceros={cruceros} />
      <Buscador cruceros={cruceros} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} sx={{ mb: 1 }}>
          <TituloSeccion antetitulo="Próximas salidas" titulo="Elija su próxima aventura" texto="Rutas con fecha confirmada y camarotes disponibles." />
          <Button component={RouterLink} to="/cruceros" endIcon={<ArrowForwardRoundedIcon />} sx={{ mb: 5 }}>Ver todos los cruceros</Button>
        </Stack>
        {cargando ? (
          <CargandoTarjetas cantidad={3} />
        ) : (
          <Grid container spacing={3}>
            {proximos.map((c) => (
              <Grid key={c.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CruceroCard crucero={c} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box sx={{ bgcolor: '#fff', borderTop: `1px solid ${colores.borde}`, borderBottom: `1px solid ${colores.borde}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
          <TituloSeccion antetitulo="Por qué Travesía" titulo="Todo claro desde el primer clic" centrado />
          <Grid container spacing={3}>
            {beneficios.map((b) => (
              <Grid key={b.titulo} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 3, height: '100%', borderRadius: 4, bgcolor: colores.arena }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colores.oceano, color: '#fff', mb: 2 }}>
                    {b.icono}
                  </Box>
                  <Typography variant="h6" gutterBottom>{b.titulo}</Typography>
                  <Typography color="text.secondary" variant="body2">{b.texto}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {destinos.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
          <TituloSeccion antetitulo="Destinos" titulo={`${destinos.length} países, un mismo mar`} texto="Filtre los cruceros por el país que más le llame." />
          <Grid container spacing={2}>
            {destinos.map(([pais, n]) => (
              <Grid key={pais} size={{ xs: 6, sm: 4, md: 2.4 }}>
                <Card component={RouterLink} to={`/cruceros?destino=${encodeURIComponent(pais)}`}
                  sx={{ p: 2.5, textDecoration: 'none', display: 'block', transition: 'all .2s', '&:hover': { borderColor: colores.laguna, transform: 'translateY(-2px)' } }}>
                  <Typography sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '1.3rem', fontWeight: 600, color: colores.tinta }}>{pais}</Typography>
                  <Typography variant="body2" color="text.secondary">{n} {n === 1 ? 'crucero' : 'cruceros'}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Box sx={{
          borderRadius: 6, p: { xs: 4, md: 7 }, color: '#fff', position: 'relative', overflow: 'hidden',
          background: `linear-gradient(120deg, ${colores.oceanoOscuro}, ${colores.oceano} 60%, ${colores.laguna})`,
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' } }}>¿Listo para zarpar?</Typography>
              <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,.8)', fontSize: '1.1rem' }}>
                Cree su cuenta gratis, elija su camarote y reciba su factura en el momento.
                {proximos[0] && ` La próxima salida es el ${fechaLarga(proximos[0].ProximaSalida)}.`}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
              <Button component={RouterLink} to="/reservar" size="large" variant="contained" color="secondary" endIcon={<ArrowForwardRoundedIcon />}>
                Reservar mi crucero
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
