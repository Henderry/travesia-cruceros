// Fechas "YYYY-MM-DD" del API tratadas como fecha local (new Date() las toma como UTC).
export function parseFechaLocal(fecha) {
  if (!fecha) return null;
  if (fecha instanceof Date) return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function formatearFecha(fecha) {
  const d = parseFechaLocal(fecha);
  return d ? d.toLocaleDateString('es-CR') : '';
}
