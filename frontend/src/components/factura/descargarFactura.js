// Genera y descarga la factura. react-pdf se carga con import dinámico.
export async function descargarFactura(reserva) {
  // react-pdf necesita Buffer para las imágenes
  if (!window.Buffer) {
    window.Buffer = (await import('buffer')).Buffer;
  }
  const [{ pdf }, { default: FacturaPDF }, { createElement }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./FacturaPDF'),
    import('react'),
  ]);
  const blob = await pdf(createElement(FacturaPDF, { reserva })).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Factura_Travesia_Reserva_${reserva.Id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
