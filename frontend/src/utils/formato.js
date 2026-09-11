import { parseFechaLocal } from './fechas';

const colones = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

/** ₡1 250 000 — acepta números o texto; vacío si no es un número válido */
export function crc(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? colones.format(n) : '—';
}

/** 14 de noviembre de 2026 */
export function fechaLarga(fecha) {
  const d = parseFechaLocal(fecha);
  return d ? d.toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
}

/** 14 nov 2026 */
export function fechaCorta(fecha) {
  const d = parseFechaLocal(fecha);
  return d
    ? d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
    : '—';
}

/** nov */
export function mesCorto(fecha) {
  const d = parseFechaLocal(fecha);
  return d ? d.toLocaleDateString('es-CR', { month: 'short' }).replace('.', '') : '';
}

export function dia(fecha) {
  const d = parseFechaLocal(fecha);
  return d ? d.getDate() : '';
}

export function sumarDias(fecha, dias) {
  const d = parseFechaLocal(fecha);
  if (!d) return null;
  d.setDate(d.getDate() + Number(dias || 0));
  return d;
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/** URL pública de una imagen subida al API */
export function urlImagen(archivo) {
  const base = import.meta.env.VITE_BASE_URL2 || '';
  return `${base}uploads/${archivo || 'default.jpg'}`;
}

/** Mensaje legible a partir de un error de Axios */
export function mensajeError(error, porDefecto = 'Ocurrió un error inesperado') {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.result) return data.result;
  if (error?.code === 'ERR_NETWORK') {
    return 'No hay conexión con el servidor. Verifique que el API esté en ejecución.';
  }
  return porDefecto;
}
