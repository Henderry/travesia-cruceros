import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/** Título de las pantallas del panel de administración */
export default function AdminEncabezado({ titulo, subtitulo, acciones }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' } }}>{titulo}</Typography>
        {subtitulo && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{subtitulo}</Typography>}
      </Box>
      {acciones}
    </Box>
  );
}
AdminEncabezado.propTypes = { titulo: PropTypes.node.isRequired, subtitulo: PropTypes.node, acciones: PropTypes.node };
