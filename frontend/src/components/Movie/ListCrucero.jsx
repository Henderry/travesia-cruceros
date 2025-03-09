import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Info } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import BarcoService from '../../services/BarcoService';
import Box from '@mui/material/Box';  
import CruceroService from '../../services/CruceroService';

export function ListCrucero() {
  // Estado para almacenar la respuesta del API
  const [data, setData] = useState(null);
  // Estado para el error en caso de ocurrir
  const [error, setError] = useState('');
  // Estado para verificar si ya se cargaron los datos
  const [loaded, setLoaded] = useState(false);

  // Llamada al API para obtener el listado de barcos
  useEffect(() => {
    CruceroService.getCruceros()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof SyntaxError) {
          setError(err);
          setLoaded(false);
        }
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {data &&
        data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Crucero:
                </Typography>
                <Typography variant="h5" component="div">
                  {item.Nombre}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Fecha de partida: {item.FechaMasReciente}
                </Typography>
              
             
              </CardContent>
              <CardActions>
                <IconButton
                  component={Link}
                  to={`/crucero/${item.Id}`}
                  aria-label="Detalle"
                  sx={{ ml: 'auto' }}
                >
                  <Info />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
