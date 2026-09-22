import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import toast from 'react-hot-toast';
import ComplementoService from '../../services/ComplementoService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { crc, mensajeError } from '../../utils/formato';

const vacio = { Id: null, Descripcion: '', Precio: '', PrecioAplicado: '' };

export default function AdminComplementos() {
  const { datos, cargando, error, recargar } = useApi(() => ComplementoService.getComplementos(), []);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [borrar, setBorrar] = useState(null);

  const abrir = (c) => { setErrores({}); setForm(c ? { ...c } : { ...vacio }); };

  const guardar = async () => {
    const e = {};
    if (form.Descripcion.trim().length < 3) e.Descripcion = 'Mínimo 3 caracteres';
    if (form.Precio === '' || Number(form.Precio) < 0) e.Precio = 'Precio no válido';
    if (form.PrecioAplicado === '' || Number(form.PrecioAplicado) < 0) e.PrecioAplicado = 'Precio no válido';
    else if (Number(form.PrecioAplicado) > Number(form.Precio)) e.PrecioAplicado = 'No puede ser mayor que el precio regular';
    setErrores(e);
    if (Object.keys(e).length) return;
    setGuardando(true);
    try {
      const datosForm = { ...form, Precio: Number(form.Precio), PrecioAplicado: Number(form.PrecioAplicado) };
      if (form.Id) await ComplementoService.updateComplemento(datosForm);
      else await ComplementoService.createComplemento(datosForm);
      toast.success(form.Id ? 'Complemento actualizado' : 'Complemento creado');
      setForm(null);
      recargar();
    } catch (err) {
      toast.error(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    try {
      await ComplementoService.deleteComplemento(borrar.Id);
      toast.success('Complemento eliminado');
      recargar();
    } catch (err) {
      toast.error(mensajeError(err));
    } finally {
      setBorrar(null);
    }
  };

  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  const colon = { input: { startAdornment: <InputAdornment position="start">₡</InputAdornment> } };

  return (
    <>
      <AdminEncabezado
        titulo="Complementos"
        subtitulo="Servicios adicionales que el cliente puede agregar a su reserva."
        acciones={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => abrir(null)}>Nuevo complemento</Button>}
      />
      <TablaAdmin
        filas={datos}
        buscarEn={['Descripcion']}
        placeholder="Buscar complemento"
        columnas={[
          { id: 'Descripcion', titulo: 'Servicio', render: (c) => <Typography sx={{ fontWeight: 700 }}>{c.Descripcion}</Typography> },
          { id: 'Precio', titulo: 'Precio regular', align: 'right', render: (c) => crc(c.Precio) },
          {
            id: 'PrecioAplicado', titulo: 'Precio vigente', align: 'right', render: (c) => (
              <Stack alignItems="flex-end">
                <b>{crc(c.PrecioAplicado)}</b>
                {Number(c.Precio) > Number(c.PrecioAplicado) && (
                  <Typography variant="caption" color="success.main">
                    −{Math.round((1 - c.PrecioAplicado / c.Precio) * 100)}% de descuento
                  </Typography>
                )}
              </Stack>
            ),
          },
          { id: 'Vendidos', titulo: 'Vendidos', align: 'right' },
          {
            id: 'acciones', titulo: '', align: 'right', render: (c) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Editar"><IconButton color="primary" onClick={() => abrir(c)}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title={Number(c.Vendidos) > 0 ? 'No se puede eliminar: ya se vendió' : 'Eliminar'}>
                  <span>
                    <IconButton color="error" disabled={Number(c.Vendidos) > 0} onClick={() => setBorrar(c)}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                  </span>
                </Tooltip>
              </Stack>
            ),
          },
        ]}
      />

      <Dialog open={Boolean(form)} onClose={() => setForm(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '1.5rem' }}>
          {form?.Id ? 'Editar complemento' : 'Nuevo complemento'}
        </DialogTitle>
        <DialogContent>
          {form && (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid size={12}>
                <TextField fullWidth label="Descripción" value={form.Descripcion} onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                  error={!!errores.Descripcion} helperText={errores.Descripcion} slotProps={{ htmlInput: { maxLength: 80 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth type="number" label="Precio regular" value={form.Precio} onChange={(e) => setForm({ ...form, Precio: e.target.value })}
                  error={!!errores.Precio} helperText={errores.Precio} slotProps={colon} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth type="number" label="Precio vigente" value={form.PrecioAplicado} onChange={(e) => setForm({ ...form, PrecioAplicado: e.target.value })}
                  error={!!errores.PrecioAplicado} helperText={errores.PrecioAplicado || 'Lo que se cobra en la reserva'} slotProps={colon} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button variant="contained" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(borrar)} onClose={() => setBorrar(null)}>
        <DialogTitle>¿Eliminar &quot;{borrar?.Descripcion}&quot;?</DialogTitle>
        <DialogContent><Typography color="text.secondary">Esta acción no se puede deshacer.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setBorrar(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={eliminar}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
