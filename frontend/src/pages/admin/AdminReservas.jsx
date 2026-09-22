import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ReservaService from '../../services/ReservaService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import EstadoPago from '../../components/ui/EstadoPago';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { crc, fechaCorta } from '../../utils/formato';

export default function AdminReservas() {
  const { datos, cargando, error, recargar } = useApi(() => ReservaService.getReservas(), []);
  const [estado, setEstado] = useState('');

  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  const filas = datos.filter((r) => !estado || (estado === 'pagada' ? r.Pagada : !r.Pagada));

  return (
    <>
      <AdminEncabezado titulo="Reservas" subtitulo="Todas las reservas de los clientes, con su estado de pago." />
      <TablaAdmin
        filas={filas}
        buscarEn={['Id', 'NombreUsuario', 'NombreCrucero']}
        placeholder="Buscar por número, cliente o crucero"
        vacio="No hay reservas con ese filtro"
        filtros={
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="f-estado">Estado</InputLabel>
            <Select labelId="f-estado" label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pagada">Pagadas</MenuItem>
              <MenuItem value="pendiente">Pendientes</MenuItem>
            </Select>
          </FormControl>
        }
        columnas={[
          { id: 'Id', titulo: '#', ancho: 60, render: (r) => <b>{r.Id}</b> },
          { id: 'NombreUsuario', titulo: 'Cliente' },
          { id: 'NombreCrucero', titulo: 'Crucero' },
          { id: 'FechaSalida', titulo: 'Salida', render: (r) => fechaCorta(r.FechaSalida) },
          { id: 'Pasajeros', titulo: 'Pax', align: 'right' },
          { id: 'Pagada', titulo: 'Estado', render: (r) => <EstadoPago pagada={r.Pagada} /> },
          { id: 'Total', titulo: 'Total', align: 'right', render: (r) => <b>{crc(r.Total)}</b> },
          { id: 'acciones', titulo: '', align: 'right', render: (r) => <Button size="small" component={RouterLink} to={`/reservas/${r.Id}`}>Ver</Button> },
        ]}
      />
    </>
  );
}
