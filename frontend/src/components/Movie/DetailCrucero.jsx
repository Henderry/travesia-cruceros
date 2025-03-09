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

import CruceroService from '../../services/CruceroService';

export function DetailCrucero() {
  const routeParams = useParams();
  console.log(routeParams);
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL2+'uploads'
  //Resultado de consumo del API, respuesta
  
  const [data, setData] = useState(null);
  const [dataIti, setDataIti] = useState(null);
  const [dataFecha, setDataFecha] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {

      CruceroService.getCruceroById(routeParams.id)
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

      CruceroService.getItinerarioById(routeParams.id)
      .then((response) => {
        setDataIti(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error('Respuesta no válida del servidor');
      });

      CruceroService.getFechasCruceroById(routeParams.id)
      .then((response) => {
        setDataFecha(response.data);
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
        <Grid container spacing={2}>
          <Grid size={5}>
            <Box
              component="img"
              sx={{
                borderRadius: '4%',
                maxWidth: '100%',
                height: 'auto',
              }}
              alt="Ticket pelicula"
              src={`${BASE_URL}/${data.Foto}`}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {/* Título pelicula */}
              {data.Nombre}
            </Typography>
            
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                {/* Duración o Tiempo pelicula */}
                {data.TotalDias} 
              </Box>{' '}
              dias de duracion
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Nombre del Barco:
              </Box>{' '}
              {/* Idioma pelicula */}
              {data.NombreBarco}
            </Typography>
            
            {dataIti && 
              <Typography component="span" variant="subtitle1">
                <Box fontWeight="bold">Itinerario:</Box>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                  }}
                  
                >
                
                  
                  {dataIti.map((item)=>( 
                    <ListItemButton key={item.id}>
                      <ListItemIcon>
                      <ArrowRightIcon />
                        Fecha: {item.Fecha}<br></br>
                        Puerto: {item.NombrePuerto}<br></br>
                        Descripcion: {item.Descripcion}

                      </ListItemIcon>
                      <ListItemText  />
                      
                    </ListItemButton>
                ))}
                
                </List>
              </Typography>
            }


            {dataFecha && 
              <Typography component="span" variant="subtitle1">
                <Box fontWeight="bold">Fechas del Crucero:</Box>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                  }}
                  
                >
                
                  
                  {dataFecha.map((item)=>( 
                    <ListItemButton key={item.id} style={{ display: "flex",  alignItems: "flex-start" }}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                        Fecha: {item.FechaSalida}<br></br>
                        <div style={{ display: "block", marginLeft: "20px" }}>
                        {item.precio_habitacion_crucero.map((item2) => (
                          <ListItemButton key={item2.id} style={{ display: "block" }}>
                            <ArrowRightIcon />
                            Habitacion: {item2.TipoHabitacion}
                            <br />
                            Precio: {item2.Precio}$
                          </ListItemButton>
                        ))}
                      </div>
                      <br></br>

                    </ListItemIcon>
                      <ListItemText  />
                      
                    </ListItemButton>
                ))}
                
                </List>
              </Typography>
            }




          </Grid>
        </Grid>
      }
    </Container>
  );
}
