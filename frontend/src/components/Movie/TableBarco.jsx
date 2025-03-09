/* eslint-disable no-unused-vars */
import * as React from "react";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, Link } from "react-router-dom";
import BarcoService from "../../services/BarcoService"; // Importamos el servicio de barcos

export default function TableBarco() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Obtener lista de barcos desde el API
  useEffect(() => {
    BarcoService.getBarcos()
      .then((response) => {
        console.log(response);
        setData(response.data); // La respuesta ya viene en response.data
        setError(""); // Si no hay error, lo dejamos vacío
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message || "Error al cargar los barcos");
        setLoaded(false);
      });
  }, []);

  const update = (id) => {
    return navigate(`/barco/update/${id}`); // Ruta ajustada para barcos
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Barcos
        <Tooltip title="Crear">
          <IconButton component={Link} to="/barco/crear/" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {data && data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de barcos">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Nombre
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Descripción
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Capacidad
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Habitaciones Disponibles
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="primary">
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.Id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.nombre}</TableCell>
                  <TableCell align="left">{row.descripcion}</TableCell>
                  <TableCell align="left">{row.capacidad}</TableCell>
                  <TableCell align="left">{row.total_habitaciones}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton
                        onClick={() => update(row.Id)}
                        color="success"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No hay barcos disponibles.</Typography>
      )}
    </>
  );
}