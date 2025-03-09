import React, { useEffect } from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccessTime from '@mui/icons-material/AccessTime';
import Language from '@mui/icons-material/Language';
import { Link } from 'react-router-dom';
import { DomainDisabled, Info } from '@mui/icons-material';
import HabitacionService from '../../services/HabitacionService';
import Box from '@mui/material/Box';






export function ListHabitacion() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  let idShopRental = 1;
  
  //Llamar al API y obtener la lista de peliculas de una tienda
  useEffect(()=>{
    HabitacionService.getHabitacion()
    .then((response)=>{
      console.log(response)
      setData(response.data)
      setError(response.error)
      setLoaded(true)
    })
    .catch((error)=>{
      console.log(error)
      if(error instanceof SyntaxError){
        setError(error)
        setLoaded(false)
      }
    })
  },[])

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  
  
  


  if(!loaded) return <p>Cargando...</p>
  if(error) return <p>Error: {error.message}</p>
  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data && data.map((item)=>(
        <Grid size={4} key={item.Id}>
          
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              Habitacion
            </Typography>
            <Typography variant="h5" component="div">
              {item.Tipo}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Tamaño: {item.Tamano} metros cuadrados</Typography>
            <Typography variant="body2">
              Maximo de huspedes:{item.MaxHuespedes} personas
              
            </Typography>
          </CardContent>
          <CardActions>
          <IconButton
                component={Link}
                to={`/habitacion/${item.Id}`}
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
  )
 
}
