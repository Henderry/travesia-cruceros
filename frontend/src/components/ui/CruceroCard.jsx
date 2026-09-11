import PropTypes from 'prop-types';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DirectionsBoatRoundedIcon from '@mui/icons-material/DirectionsBoatRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { crc, fechaCorta, urlImagen } from '../../utils/formato';
import { colores, sombra } from '../../themes/theme';

export default function CruceroCard({ crucero }) {
  const agotado = !crucero.ProximaSalida;
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform .25s ease, box-shadow .25s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: sombra.media },
        '&:hover img': { transform: 'scale(1.05)' },
      }}
    >
      <CardActionArea component={RouterLink} to={`/cruceros/${crucero.Id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <Box
            component="img"
            src={urlImagen(crucero.Foto)}
            alt={crucero.Nombre}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,31,51,0) 45%, rgba(11,31,51,.55) 100%)' }} />
          {crucero.CantDias && (
            <Chip
              label={`${crucero.CantDias} días`}
              size="small"
              sx={{ position: 'absolute', top: 14, left: 14, bgcolor: 'rgba(255,255,255,.92)', color: colores.tinta }}
            />
          )}
          <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', bottom: 12, left: 14, color: '#fff', alignItems: 'center' }}>
            <PlaceRoundedIcon sx={{ fontSize: 17 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {(crucero.Destinos || []).join(' · ')}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontSize: '1.4rem', mb: 1 }}>{crucero.Nombre}</Typography>
          <Stack spacing={0.75} sx={{ color: 'text.secondary', mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsBoatRoundedIcon sx={{ fontSize: 18, color: colores.laguna }} />
              <Typography variant="body2">{crucero.NombreBarco} · {crucero.Paradas} paradas</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: colores.laguna }} />
              <Typography variant="body2">
                {agotado ? 'Sin salidas programadas' : `Próxima salida: ${fechaCorta(crucero.ProximaSalida)}`}
                {crucero.Salidas > 1 && ` · ${crucero.Salidas} fechas`}
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px dashed ${colores.borde}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Desde</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: colores.tinta, lineHeight: 1.1 }}>
                {crucero.PrecioDesde ? crc(crucero.PrecioDesde) : 'Consultar'}
              </Typography>
              <Typography variant="caption" color="text.secondary">por camarote</Typography>
            </Box>
            <Typography sx={{ color: colores.coral, fontWeight: 700, fontSize: '0.95rem' }}>Ver crucero →</Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

CruceroCard.propTypes = {
  crucero: PropTypes.shape({
    Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    Nombre: PropTypes.string,
    Foto: PropTypes.string,
    NombreBarco: PropTypes.string,
    ProximaSalida: PropTypes.string,
    Salidas: PropTypes.number,
    CantDias: PropTypes.number,
    PrecioDesde: PropTypes.number,
    Destinos: PropTypes.arrayOf(PropTypes.string),
    Paradas: PropTypes.number,
  }).isRequired,
};
