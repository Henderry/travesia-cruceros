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
import HabitacionService from "../../services/HabitacionService";

export default function TableHabitacion() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Obtener lista de habitaciones desde el API
  useEffect(() => {
    HabitacionService.getHabitacion()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
        setLoaded(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

  const update = (id) => {
    return navigate(`/habitacion/update/${id}`);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Habitaciones
        <Tooltip title="Crear">
          <IconButton component={Link} to="/habitacion/crear/" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      
      {data && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de habitaciones">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Descripción
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Tipo
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary">
                    Precio
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
                  <TableCell align="left">{row.Descripcion}</TableCell>
                  <TableCell align="left">{row.Tipo}</TableCell>
                  <TableCell align="left">{row.Precio}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton onClick={() => update(row.Id)} color="success">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
 