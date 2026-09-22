import { Link as RouterLink } from 'react-router-dom';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import BarcoService from '../../services/BarcoService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';

export default function AdminBarcos() {
  const { datos, cargando, error, recargar } = useApi(() => BarcoService.catalogo(), []);
  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  return (
    <>
      <AdminEncabezado
        titulo="Barcos"
        subtitulo="La flota y la cantidad de camarotes de cada tipo."
        acciones={<Button variant="contained" startIcon={<AddRoundedIcon />} component={RouterLink} to="/admin/barcos/crear">Nuevo barco</Button>}
      />
      <TablaAdmin
        filas={datos}
        buscarEn={['Nombre', 'Descripcion']}
        placeholder="Buscar barco"
        columnas={[
          { id: 'Nombre', titulo: 'Barco', render: (b) => <Typography sx={{ fontWeight: 700 }}>{b.Nombre}</Typography> },
          { id: 'Descripcion', titulo: 'Descripción' },
          { id: 'Capacidad', titulo: 'Capacidad', align: 'right', render: (b) => Number(b.Capacidad).toLocaleString('es-CR') },
          { id: 'Camarotes', titulo: 'Camarotes', align: 'right', render: (b) => Number(b.Camarotes).toLocaleString('es-CR') },
          { id: 'Cruceros', titulo: 'Rutas', align: 'right' },
          {
            id: 'acciones', titulo: '', align: 'right', render: (b) => (
              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                <Tooltip title="Ver en el sitio"><IconButton component={RouterLink} to={`/barcos/${b.Id}`}><VisibilityRoundedIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Editar"><IconButton color="primary" component={RouterLink} to={`/admin/barcos/editar/${b.Id}`}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip>
              </Stack>
            ),
          },
        ]}
      />
    </>
  );
}
