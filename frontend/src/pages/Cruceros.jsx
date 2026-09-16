import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Button, Card, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CruceroService from '../services/CruceroService';
import useApi from '../hooks/useApi';
import CruceroCard from '../components/ui/CruceroCard';
import { EncabezadoPagina } from '../components/ui/Encabezado';
import { CargandoTarjetas, EstadoError, EstadoVacio } from '../components/ui/Estados';
import { parseFechaLocal } from '../utils/fechas';

const ordenes = {
  fecha: { label: 'Próxima salida', fn: (a, b) => (a.ProximaSalida || '9999').localeCompare(b.ProximaSalida || '9999') },
  precio: { label: 'Precio: menor a mayor', fn: (a, b) => (a.PrecioDesde ?? Infinity) - (b.PrecioDesde ?? Infinity) },
  duracion: { label: 'Duración', fn: (a, b) => (a.CantDias ?? 0) - (b.CantDias ?? 0) },
};

function claveMes(fecha) {
  const d = parseFechaLocal(fecha);
  return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : null;
}

export default function Cruceros() {
  const { datos, cargando, error, recargar } = useApi(() => CruceroService.catalogo(), []);
  const [params, setParams] = useSearchParams();
  const destino = params.get('destino') || '';
  const mes = params.get('mes') || '';
  const orden = ordenes[params.get('orden')] ? params.get('orden') : 'fecha';

  const cambiar = (clave, valor) => {
    const p = new URLSearchParams(params);
    if (valor) p.set(clave, valor);
    else p.delete(clave);
    setParams(p, { replace: true });
  };

  const destinos = useMemo(() => [...new Set((datos || []).flatMap((c) => c.Destinos || []))].sort(), [datos]);
  const meses = useMemo(() => {
    const m = new Map();
    (datos || []).forEach((c) => {
      const k = claveMes(c.ProximaSalida);
      if (k) m.set(k, parseFechaLocal(c.ProximaSalida).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }));
    });
    return [...m.entries()].sort();
  }, [datos]);

  const lista = useMemo(
    () =>
      (datos || [])
        .filter((c) => !destino || (c.Destinos || []).includes(destino))
        .filter((c) => !mes || claveMes(c.ProximaSalida) === mes)
        .sort(ordenes[orden].fn),
    [datos, destino, mes, orden]
  );

  return (
    <>
      <EncabezadoPagina
        titulo="Nuestros cruceros"
        subtitulo="Rutas por el Caribe y el Pacífico con salida desde Costa Rica. Compare fechas, duración y precios."
        migas={[{ label: 'Inicio', to: '/' }, { label: 'Cruceros' }]}
      />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Card sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 'auto' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 1, color: 'text.secondary' }}>
                <TuneRoundedIcon />
                <Typography sx={{ fontWeight: 700 }}>Filtrar</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="f-destino">Destino</InputLabel>
                <Select labelId="f-destino" label="Destino" value={destino} onChange={(e) => cambiar('destino', e.target.value)}>
                  <MenuItem value="">Todos</MenuItem>
                  {destinos.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="f-mes">Mes de salida</InputLabel>
                <Select labelId="f-mes" label="Mes de salida" value={mes} onChange={(e) => cambiar('mes', e.target.value)}>
                  <MenuItem value="">Cualquier fecha</MenuItem>
                  {meses.map(([k, l]) => <MenuItem key={k} value={k} sx={{ textTransform: 'capitalize' }}>{l}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="f-orden">Ordenar por</InputLabel>
                <Select labelId="f-orden" label="Ordenar por" value={orden} onChange={(e) => cambiar('orden', e.target.value === 'fecha' ? '' : e.target.value)}>
                  {Object.entries(ordenes).map(([k, o]) => <MenuItem key={k} value={k}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            {(destino || mes) && (
              <Grid size={{ xs: 12, md: 'grow' }} sx={{ textAlign: { md: 'right' } }}>
                <Button onClick={() => setParams({}, { replace: true })}>Limpiar filtros</Button>
              </Grid>
            )}
          </Grid>
        </Card>

        {cargando && <CargandoTarjetas />}
        {error && <EstadoError mensaje={error} onReintentar={recargar} />}
        {!cargando && !error && (
          <>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {lista.length} {lista.length === 1 ? 'crucero encontrado' : 'cruceros encontrados'}
            </Typography>
            {lista.length === 0 ? (
              <EstadoVacio
                titulo="No hay cruceros con esos filtros"
                texto="Pruebe con otro destino o fecha."
                accion={<Button variant="outlined" onClick={() => setParams({})}>Ver todos</Button>}
              />
            ) : (
              <Grid container spacing={3}>
                {lista.map((c) => (
                  <Grid key={c.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <CruceroCard crucero={c} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        <Box sx={{ height: 24 }} />
      </Container>
    </>
  );
}
