import PropTypes from 'prop-types';
import { Box, Card, Typography } from '@mui/material';
import { colores } from '../../themes/theme';

export default function StatCard({ etiqueta, valor, detalle, icono, tono = colores.oceano }) {
  return (
    <Card sx={{ p: 2.5, height: '100%', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 46, height: 46, borderRadius: 3, flexShrink: 0, display: 'grid', placeItems: 'center',
          bgcolor: `${tono}1A`, color: tono,
        }}
      >
        {icono}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{etiqueta}</Typography>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: colores.tinta, lineHeight: 1.2, mt: 0.5, fontVariantNumeric: 'tabular-nums' }}>
          {valor}
        </Typography>
        {detalle && <Typography variant="caption" color="text.secondary">{detalle}</Typography>}
      </Box>
    </Card>
  );
}
StatCard.propTypes = {
  etiqueta: PropTypes.string.isRequired,
  valor: PropTypes.node.isRequired,
  detalle: PropTypes.node,
  icono: PropTypes.node,
  tono: PropTypes.string,
};
