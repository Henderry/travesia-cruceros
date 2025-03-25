import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CruceroService from "../../services/CruceroService";
import BarcoService from "../../services/BarcoService";

export default function TableCrucero() {
  const navigate = useNavigate();
  const [cruceros, setCruceros] = useState([]); // Lista de cruceros
  const [barcos, setBarcos] = useState([]); // Lista de barcos
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      const barcosResponse = await BarcoService.getBarcos();
      console.log("Barcos cargados:", barcosResponse.data);
      setBarcos(barcosResponse.data);

      const crucerosResponse = await CruceroService.getCruceros();
      console.log("Cruceros cargados:", crucerosResponse.data);
      setCruceros(crucerosResponse.data);
      setLoaded(true);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };
  fetchData();
}, []);

  // Función para obtener el barco correspondiente a un crucero
  const getBarcoById = (idBarco) => {
    return barcos.find((barco) => barco.Id === idBarco) || { Nombre: "Nombre no disponible" };
  };

  const update = (id) => navigate(`/crucero/update/${id}`);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Cruceros
        <Tooltip title="Crear">
          <IconButton component={Link} to="/crucero/crear/" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de cruceros">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Barco</TableCell>
              <TableCell>Días Totales</TableCell>
              <TableCell>Próxima Salida</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cruceros.map((crucero) => {
              // Obtener el objeto barco vinculado al crucero
              const barco = getBarcoById(crucero.IdBarco);

              return (
                <TableRow key={crucero.Id}>
                  <TableCell>{crucero.Nombre}</TableCell>
                  <TableCell>{barco.nombre}</TableCell>
                  <TableCell>{crucero.TotalDias || "No especificado"}</TableCell>
                  <TableCell>
                    {crucero.FechaMasReciente
                      ? new Date(crucero.FechaMasReciente).toLocaleDateString()
                      : "Sin fechas"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => update(crucero.Id)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}