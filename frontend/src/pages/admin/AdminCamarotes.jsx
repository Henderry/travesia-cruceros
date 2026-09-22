import { Link as RouterLink } from 'react-router-dom';
import { Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HabitacionService from '../../services/HabitacionService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { crc } from '../../utils/formato';

export default function AdminCamarotes() {
  const { datos, cargando, error, recargar } = useApi(() => HabitacionService.getHabitacion(), []);
  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  return (
    <>
      <AdminEncabezado
        titulo="Camarotes"
        subtitulo="Tipos de camarote, capacidad y tarifa base."
        acciones={<Button variant="contained" startIcon={<AddRoundedIcon />} component={RouterLink} to="/admin/camarotes/crear">Nuevo camarote</Button>}
      />
      <TablaAdmin
        filas={datos}
        buscarEn={['Tipo', 'Descripcion']}
        placeholder="Buscar camarote"
        columnas={[
          { id: 'Tipo', titulo: 'Tipo', render: (h) => <Typography sx={{ fontWeight: 700 }}>{h.Tipo}</Typography> },
          { id: 'Descripcion', titulo: 'Descripción', render: (h) => <Typography variant="body2" color="text.secondary">{h.Descripcion}</Typography> },
          { id: 'Tamano', titulo: 'Tamaño', align: 'right', render: (h) => `${h.Tamano} m²` },
          { id: 'MaxHuespedes', titulo: 'Huéspedes', align: 'right', render: (h) => `${h.MinHuespedes}–${h.MaxHuespedes}` },
          { id: 'Precio', titulo: 'Tarifa base', align: 'right', render: (h) => crc(h.Precio) },
          { id: 'Disponibilidad', titulo: 'Estado', render: (h) => (Number(h.Disponibilidad) ? <Chip size="small" label="Activo" color="success" variant="outlined" /> : <Chip size="small" label="Inactivo" variant="outlined" />) },
          { id: 'acciones', titulo: '', align: 'right', render: (h) => <Tooltip title="Editar"><IconButton color="primary" component={RouterLink} to={`/admin/camarotes/editar/${h.Id}`}><EditRoundedIcon fontSize="small" /></IconButton></Tooltip> },
        ]}
      />
    </>
  );
}
