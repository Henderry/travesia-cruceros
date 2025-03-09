import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Grid from '@mui/material/Grid2';
//import ticket from '../../assets/ticket.jpg';
import HabitacionService from '../../services/HabitacionService';

export function DetailHabitacion() {
  const routeParams = useParams();
  console.log(routeParams);
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL+'uploads'
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener una pelicula
    HabitacionService.getHabitacionById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error('Respuesta no válida del servidor');
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
  {data && 
    <Box 
      sx={{ 
        p: 4,
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: 3,
        textAlign: 'center'
      }}
    >
      {/* Título Principal */}
      <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
        {data.Descripcion}
      </Typography>

      {/* Sección de Datos Básicos - Modificado */}
      <Grid 
        container 
        spacing={4} 
        sx={{ 
          mb: 4,
          justifyContent: 'center', // Centra horizontalmente
          textAlign: 'center' // Centra el texto
        }}
      >
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
        <Typography variant="h5">
             Id: <Box component="span" fontWeight="bold">{data.Id}</Box>
          </Typography>
          <Typography variant="h5">
             Tipo: <Box component="span" fontWeight="bold">{data.Tipo}</Box>
          </Typography>
          <Typography variant="h5">
             Minima cantidad de huespedes: <Box component="span" fontWeight="bold">{data.MinHusoedes} personas</Box>
          </Typography>
          <Typography variant="h5">
             Maxima cantidad de huespedes: <Box component="span" fontWeight="bold">{data.MaxHuespedes} personas</Box>
          </Typography>
          <Typography variant="h5">
             Tamano de la habitacion: <Box component="span" fontWeight="bold">{data.Tamano} metros cuadrados</Box>
          </Typography>
          
          
        </Grid>
        
        
      </Grid>

      
    </Box>
  }
</Container>
  );
}
