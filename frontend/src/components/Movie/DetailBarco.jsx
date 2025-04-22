import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
//import ticket from '../../assets/ticket.jpg';
import BarcoService from '../../services/BarcoService';

export function DetailBarco() {
  const routeParams = useParams();
  console.log(routeParams);
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL+'uploads'
  //Resultado de consumo del API, respuesta
  const [data , setData] = useState(null);
  const [dataHab , setDataHab] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // Obtener datos del barco
    BarcoService.getBarcoById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log("Datos del barco:", response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el barco:", error);
        setError("Error al cargar los datos del barco.");
      });

    // Obtener lista de habitaciones del barco
    BarcoService.getListaHabitacionesByBarco(routeParams.id)
      .then((response) => {
        setDataHab(response.data); // Asegúrate de que response.data sea un array
        console.log("Datos de habitaciones:", response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las habitaciones:", error);
        setError("Error al cargar las habitaciones.");
      })
      .finally(() => {
        setLoaded(true); // Marcar como cargado cuando ambas peticiones terminen
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
        {data.Nombre}
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
             Nombre: <Box component="span" fontWeight="bold">{data.Nombre}</Box>
          </Typography>
          <Typography variant="h5">
             Descripccion: <Box component="span" fontWeight="bold">{data.Descripcion} </Box>
          </Typography>
          <Typography variant="h5">
             Capacidad: <Box component="span" fontWeight="bold">{data.Capacidad} personas</Box>
          </Typography>
          <Typography variant="h5">
             Habitaciones Disponibles: <Box component="span" fontWeight="bold">{data.HabitacionesDispoinbles} disponibles</Box>
          </Typography>
          <br></br>
          <Typography variant="h5">
             <Box component="span" fontWeight="bold">Lista de habitaciones:</Box>
          </Typography>
          <br></br>

          {dataHab &&
        dataHab.map((item) => (
          <Grid item  key={item.Id}>
            <Typography variant="h5">
             Habitacion:<Box component="span" fontWeight="bold">{item.Tipo}</Box>
          </Typography>
          <Typography variant="h5">
             Disponibles: <Box component="span" fontWeight="bold">{item.CantDisponible}</Box>
          </Typography>
          <br></br>
          </Grid>
          
        ))}
        
          
        </Grid>
        
        
      </Grid>

      
    </Box>
  }
</Container>
  );
}
