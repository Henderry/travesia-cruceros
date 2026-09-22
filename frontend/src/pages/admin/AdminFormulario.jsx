import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

/** Marco común para los formularios de mantenimiento existentes */
export default function AdminFormulario({ volverA, children }) {
  return (
    <>
      <Button component={RouterLink} to={volverA} startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 2 }}>
        Volver al listado
      </Button>
      <Card sx={{ p: { xs: 1, md: 2 } }}>{children}</Card>
    </>
  );
}
AdminFormulario.propTypes = { volverA: PropTypes.string.isRequired, children: PropTypes.node.isRequired };
