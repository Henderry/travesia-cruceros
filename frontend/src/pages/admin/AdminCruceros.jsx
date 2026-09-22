import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CruceroService from '../../services/CruceroService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { crc, fechaCorta, urlImagen } from '../../utils/formato';

export default function AdminCruceros() {
  const { datos, cargando, error, recargar } = useApi(() => CruceroService.catalogo(), []);
  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  return (
    <>
      <AdminEncabezado
        titulo="Cruceros"
        subtitulo="Rutas, itinerarios, fechas de salida y tarifas por camarote."
        acciones={<Button variant="contained" startIcon={<AddRoundedIcon />} component={RouterLink} to="/admin/cruceros/crear">Nuevo crucero</Button>}
      />
      <TablaAdmin
        filas={datos}
        buscarEn={['Nombre', 'NombreBarco']}
        placeholder="Buscar crucero o barco"
        columnas={[
          {
            id: 'Nombre', titulo: 'Crucero', render: (c) => (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar variant="rounded" src={urlImagen(c.Foto)} sx={{ width: 56, height: 40, borderRadius: 2 }} />
                <Typography sx={{ fontWeight: 700 }}>{c.Nombre}</Typography>
              </Stack>
            ),
          },
          { id: 'NombreBarco', titulo: 'Barco' },
          { id: 'Destinos', titulo: 'Destinos', render: (c) => (c.Destinos || []).join(', ') },
          { id: 'ProximaSalida', titulo: 'Próxima salida', render: (c) => (c.ProximaSalida ? fechaCorta(c.ProximaSalida) : '—') },
          { id: 'Salidas', titulo: 'Salidas', align: 'right' },
          { id: 'PrecioDesde', titulo: 'Desde', align: 'right', render: (c) => crc(c.PrecioDesde) },
          {
            id: 'acciones', titulo: '', align: 'right', render: (c) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Ver en el sitio"><IconButton component={RouterLink} to={`/cruceros/${c.Id}`}><VisibilityRoundedIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Editar"><IconButton color="primary" component={RouterLink} to={`/admin/cruceros/editar/${c.Id}`}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip>
              </Stack>
            ),
          },
        ]}
      />
    </>
  );
}
