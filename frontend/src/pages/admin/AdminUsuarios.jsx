import { Avatar, Chip, Stack, Typography } from '@mui/material';
import AuthService from '../../services/AuthService';
import useApi from '../../hooks/useApi';
import AdminEncabezado from '../../components/ui/AdminEncabezado';
import TablaAdmin from '../../components/ui/TablaAdmin';
import { CargandoDetalle, EstadoError } from '../../components/ui/Estados';
import { fechaCorta, iniciales } from '../../utils/formato';
import { colores } from '../../themes/theme';

export default function AdminUsuarios() {
  const { datos, cargando, error, recargar } = useApi(() => AuthService.usuarios(), []);
  if (cargando) return <CargandoDetalle />;
  if (error) return <EstadoError mensaje={error} onReintentar={recargar} />;

  return (
    <>
      <AdminEncabezado titulo="Usuarios" subtitulo="Clientes y administradores registrados. Las contraseñas se guardan cifradas con bcrypt." />
      <TablaAdmin
        clave="id"
        filas={datos}
        buscarEn={['Nombre', 'Correo', 'Pais']}
        placeholder="Buscar por nombre, correo o país"
        columnas={[
          {
            id: 'Nombre', titulo: 'Usuario', render: (u) => (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 36, height: 36, bgcolor: u.Rol === 'Administrador' ? colores.coral : colores.oceano, fontSize: '0.85rem', fontWeight: 700 }}>{iniciales(u.Nombre)}</Avatar>
                <div>
                  <Typography sx={{ fontWeight: 700 }}>{u.Nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.Correo}</Typography>
                </div>
              </Stack>
            ),
          },
          { id: 'Rol', titulo: 'Rol', render: (u) => <Chip size="small" label={u.Rol} color={u.Rol === 'Administrador' ? 'secondary' : 'default'} variant={u.Rol === 'Administrador' ? 'filled' : 'outlined'} /> },
          { id: 'Pais', titulo: 'País' },
          { id: 'Telefono', titulo: 'Teléfono' },
          { id: 'Reservas', titulo: 'Reservas', align: 'right' },
          { id: 'FechaRegistro', titulo: 'Registro', render: (u) => fechaCorta(u.FechaRegistro) },
        ]}
      />
    </>
  );
}
