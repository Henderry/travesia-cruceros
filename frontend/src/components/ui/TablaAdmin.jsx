import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TextField, Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { EstadoVacio } from './Estados';

/**
 * Tabla del panel de administración con búsqueda y paginación.
 * columnas: [{ id, titulo, render?(fila), align?, ancho? }]
 */
export default function TablaAdmin({ columnas, filas, buscarEn = [], placeholder = 'Buscar…', vacio = 'Sin registros', filtros, clave = 'Id' }) {
  const [texto, setTexto] = useState('');
  const [pagina, setPagina] = useState(0);
  const [porPagina, setPorPagina] = useState(10);

  const filtradas = useMemo(() => {
    const t = texto.trim().toLowerCase();
    if (!t) return filas;
    return filas.filter((f) => buscarEn.some((campo) => String(f[campo] ?? '').toLowerCase().includes(t)));
  }, [filas, texto, buscarEn]);

  const visibles = filtradas.slice(pagina * porPagina, pagina * porPagina + porPagina);

  return (
    <Card>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2 }} alignItems={{ md: 'center' }}>
        {buscarEn.length > 0 && (
          <TextField
            size="small" placeholder={placeholder} value={texto}
            onChange={(e) => { setTexto(e.target.value); setPagina(0); }}
            sx={{ width: { xs: '100%', md: 320 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
          />
        )}
        {filtros}
        <Typography variant="body2" color="text.secondary" sx={{ ml: { md: 'auto !important' } }}>
          {filtradas.length} {filtradas.length === 1 ? 'registro' : 'registros'}
        </Typography>
      </Stack>
      {filtradas.length === 0 ? (
        <EstadoVacio titulo={vacio} />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columnas.map((c) => <TableCell key={c.id} align={c.align} sx={{ width: c.ancho }}>{c.titulo}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibles.map((f) => (
                  <TableRow key={f[clave]} hover>
                    {columnas.map((c) => <TableCell key={c.id} align={c.align}>{c.render ? c.render(f) : f[c.id]}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={filtradas.length} page={pagina} rowsPerPage={porPagina}
            onPageChange={(_, p) => setPagina(p)}
            onRowsPerPageChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(0); }}
            rowsPerPageOptions={[10, 25, 50]} labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          />
        </>
      )}
    </Card>
  );
}

TablaAdmin.propTypes = {
  columnas: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.node,
    render: PropTypes.func,
    align: PropTypes.string,
    ancho: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })).isRequired,
  filas: PropTypes.array.isRequired,
  buscarEn: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  vacio: PropTypes.string,
  filtros: PropTypes.node,
  clave: PropTypes.string,
};
