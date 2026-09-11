import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { colores } from '../../themes/theme';

/** Marca de Travesía: sello con olas + nombre en serif */
export function LogoMarca({ size = 36 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 40 40"
      sx={{ width: size, height: size, flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tv-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colores.laguna} />
          <stop offset="1" stopColor={colores.oceanoOscuro} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#tv-grad)" />
      <circle cx="27" cy="13" r="4.2" fill="#FFE2B8" />
      <path d="M6 22c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 29c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2.4" strokeLinecap="round" />
    </Box>
  );
}
LogoMarca.propTypes = { size: PropTypes.number };

export default function Logo({ claro = false, size = 36 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <LogoMarca size={size} />
      <Box sx={{ lineHeight: 1 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: '"Fraunces Variable", Georgia, serif',
            fontWeight: 600,
            fontSize: size * 0.62,
            letterSpacing: '-0.02em',
            color: claro ? '#fff' : colores.tinta,
            display: 'block',
          }}
        >
          Travesía
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: claro ? 'rgba(255,255,255,.7)' : colores.textoSuave,
            display: 'block',
            mt: 0.25,
          }}
        >
          CRUCEROS
        </Typography>
      </Box>
    </Box>
  );
}
Logo.propTypes = { claro: PropTypes.bool, size: PropTypes.number };
