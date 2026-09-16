import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { LogoMarca } from '../components/ui/Logo';
import { colores } from '../themes/theme';

export default function NoEncontrado() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
      <Box sx={{ display: 'inline-block', mb: 3 }}><LogoMarca size={64} /></Box>
      <Typography sx={{ fontFamily: '"Fraunces Variable", serif', fontSize: '5rem', fontWeight: 600, color: colores.oceano, lineHeight: 1 }}>404</Typography>
      <Typography variant="h4" sx={{ mt: 2 }}>Esta página se fue a la deriva</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        La dirección no existe o fue cambiada. Volvamos a tierra firme.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button component={RouterLink} to="/" variant="contained">Ir al inicio</Button>
        <Button component={RouterLink} to="/cruceros" variant="outlined">Ver cruceros</Button>
      </Stack>
    </Container>
  );
}
