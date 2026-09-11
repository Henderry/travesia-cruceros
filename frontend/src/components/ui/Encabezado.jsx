import PropTypes from 'prop-types';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { colores } from '../../themes/theme';

/** Banda de título para las páginas internas */
export function EncabezadoPagina({ titulo, subtitulo, migas = [], acciones }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${colores.tinta} 0%, ${colores.oceanoOscuro} 60%, ${colores.oceano} 100%)`,
        color: '#fff',
        pt: { xs: 5, md: 7 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, opacity: 0.18,
          backgroundImage: 'radial-gradient(circle at 85% 20%, #3AAFA9 0, transparent 40%), radial-gradient(circle at 10% 110%, #E07A5F 0, transparent 35%)',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {migas.length > 0 && (
          <Breadcrumbs sx={{ mb: 2, color: 'rgba(255,255,255,.6)', '& a': { color: 'rgba(255,255,255,.75)' } }}>
            {migas.map((m) =>
              m.to ? (
                <Link key={m.label} component={RouterLink} to={m.to}>{m.label}</Link>
              ) : (
                <Typography key={m.label} sx={{ color: '#fff' }} variant="body2">{m.label}</Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Box sx={{ display: 'flex', alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '3rem' } }}>{titulo}</Typography>
            {subtitulo && (
              <Typography sx={{ mt: 1.5, maxWidth: 640, color: 'rgba(255,255,255,.78)', fontSize: '1.05rem' }}>
                {subtitulo}
              </Typography>
            )}
          </Box>
          {acciones}
        </Box>
      </Container>
    </Box>
  );
}
EncabezadoPagina.propTypes = {
  titulo: PropTypes.node.isRequired,
  subtitulo: PropTypes.node,
  migas: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, to: PropTypes.string })),
  acciones: PropTypes.node,
};

/** Título de sección con antetítulo */
export function TituloSeccion({ antetitulo, titulo, texto, centrado = false, claro = false }) {
  return (
    <Box sx={{ textAlign: centrado ? 'center' : 'left', mb: 5, maxWidth: centrado ? 720 : 'none', mx: centrado ? 'auto' : 0 }}>
      {antetitulo && (
        <Typography variant="overline" sx={{ color: claro ? colores.laguna : colores.oceano }}>{antetitulo}</Typography>
      )}
      <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' }, color: claro ? '#fff' : colores.tinta, mt: 0.5 }}>
        {titulo}
      </Typography>
      {texto && (
        <Typography sx={{ mt: 1.5, color: claro ? 'rgba(255,255,255,.75)' : 'text.secondary', fontSize: '1.05rem' }}>
          {texto}
        </Typography>
      )}
    </Box>
  );
}
TituloSeccion.propTypes = {
  antetitulo: PropTypes.string,
  titulo: PropTypes.node.isRequired,
  texto: PropTypes.node,
  centrado: PropTypes.bool,
  claro: PropTypes.bool,
};
