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
import ReservaService from '../../services/ReservaService';


import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF"; // Asegúrate de que la ruta sea correcta
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Ícono para el botón


export function DetailReserva() {
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
    ReservaService.getReservaById(routeParams.id)
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
        <Box sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          p: 4,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Encabezado */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Factura de Reserva #{data.Id}
          </Typography>

          {/* Información básica */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Nombre:</strong> {data.NombreUsuario}</Typography>
              <Typography variant="body1"><strong>Crucero:</strong> {data.NombreCrucero}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Salida:</strong> {new Date(data.FechaSalida).toLocaleDateString()}  --  <strong>Puerto de Salida:</strong> {data.PuertoSalida}
              </Typography>
              <Typography variant="body1">
                <strong>Regreso:</strong> {new Date(data.FechaRegreso).toLocaleDateString()} --<strong>Puerto de Regreso:</strong> {data.PuertoRegreso}
              </Typography>
            </Grid>
          </Grid>

          {/* Habitaciones */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ccc' }}>
              Habitaciones
            </Typography>
            <List>
              {data.InfoHabitaciones.map((habitacion, index) => (
                <ListItemButton key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={habitacion.NombreHabitacion}
                    secondary={`${habitacion.CantidadHuespedes} huésped(es)`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Complementos */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #ccc' }}>
              Servicios Adicionales
            </Typography>
            <List>
              {data.InfoComplementos.map((complemento, index) => (
                <ListItemButton key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <ArrowRightIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${complemento.NombreComplemento} (x${complemento.CantidadComplemento})`}
                    secondary={`₡${Number(complemento.PrecioTotal).toLocaleString()}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Resumen de precios */}
          <Box sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            p: 2,
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom>Resumen de Pagos</Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>Habitaciones:</Typography>
                <Typography>Servicios:</Typography>
                <Typography>SubTotal:</Typography>
                <Typography>IVA ({data.IVA}%):</Typography>
                
                <Typography variant="h6" sx={{ mt: 1 }}>Total:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography>₡{Number(data.PrecioTotalHabitacione).toLocaleString()}</Typography>
                <Typography>₡{(Number(data.PrecioFinal) - Number(data.PrecioTotalHabitacione)).toLocaleString()}</Typography>
                <Typography>₡{(data.PrecioFinal).toLocaleString()}</Typography>
                <Typography>₡{(data.PrecioFinal * data.IVA / 100).toLocaleString()}</Typography>
                
                <Typography variant="h6" sx={{ mt: 1 }}>
                  ₡{Number(data.PrecioTotal).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Estado de pago */}
          <Box sx={{ 
            backgroundColor: data.EstadoPago === '0' ? '#ffebee' : '#e8f5e9',
            p: 2,
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <Typography variant="body1">
              {data.EstadoPago === '0' 
                ? `Pendiente de pago - Vence el ${new Date(data.FechaLimitePago).toLocaleDateString()}`
                : 'Pago completado'}
            </Typography>
          </Box>
        
          <Box sx={{ textAlign: "center", mt: 3 }}>
  <PDFDownloadLink
    document={<InvoicePDF data={data} />}
    fileName={`Factura_Reserva_${data.Id}.pdf`}
    style={{ textDecoration: "none" }}
  >
    {({ loading }) => (
      <Button
        variant="contained"
        color="primary"
        startIcon={<PictureAsPdfIcon />}
        disabled={loading}
      >
        {loading ? "Generando PDF..." : "Descargar PDF"}
      </Button>
    )}
  </PDFDownloadLink>
</Box>
        
        </Box>
      }
    </Container>
  );
}
