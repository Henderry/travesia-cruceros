/** Validación local de tarjetas. Los datos nunca se envían ni se guardan. */
export function luhnValido(numero) {
  const limpio = String(numero).replace(/\D/g, '');
  if (limpio.length < 13 || limpio.length > 19) return false;
  let suma = 0;
  let doble = false;
  for (let i = limpio.length - 1; i >= 0; i--) {
    let d = Number(limpio[i]);
    if (doble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    suma += d;
    doble = !doble;
  }
  return suma % 10 === 0;
}

export function vencimientoValido(mmaa) {
  const m = /^(\d{2})\/(\d{2})$/.exec(mmaa || '');
  if (!m) return false;
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return false;
  const fin = new Date(anio, mes, 0, 23, 59, 59);
  return fin >= new Date();
}

export function marcaTarjeta(numero) {
  const n = String(numero).replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'American Express';
  return '';
}

export function formatearNumero(valor) {
  return String(valor).replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatearVencimiento(valor) {
  const d = String(valor).replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
