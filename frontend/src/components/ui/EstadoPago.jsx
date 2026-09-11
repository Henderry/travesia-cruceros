import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';

export default function EstadoPago({ pagada, size = 'small' }) {
  return pagada ? (
    <Chip size={size} icon={<CheckCircleRoundedIcon />} label="Pagada" sx={{ bgcolor: 'rgba(46,139,87,.12)', color: '#236B43', '& .MuiChip-icon': { color: '#2E8B57' } }} />
  ) : (
    <Chip size={size} icon={<ScheduleRoundedIcon />} label="Pendiente de pago" sx={{ bgcolor: 'rgba(201,138,18,.14)', color: '#8A5E08', '& .MuiChip-icon': { color: '#C98A12' } }} />
  );
}
EstadoPago.propTypes = { pagada: PropTypes.bool, size: PropTypes.string };
