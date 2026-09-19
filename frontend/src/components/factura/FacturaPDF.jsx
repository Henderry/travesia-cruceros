import PropTypes from 'prop-types';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from './logo.png';
import { parseFechaLocal } from '../../utils/fechas';

// Las fuentes estándar del PDF no tienen el símbolo ₡
function monto(valor) {
  const n = Math.round(Number(valor) || 0);
  return 'CRC ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function fecha(f) {
  const d = parseFechaLocal(f);
  return d ? d.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
}

// Sin separación silábica automática (evita cortes como "comodi-dad")
Font.registerHyphenationCallback((palabra) => [palabra]);

const c = { tinta: '#0B1F33', oceano: '#0E5E6F', suave: '#5B6B7B', borde: '#E6E0D6', arena: '#F7F3EC', coral: '#E07A5F', exito: '#2E8B57' };

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 56, paddingHorizontal: 40, fontSize: 9.5, fontFamily: 'Helvetica', color: c.tinta },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  marca: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 38, height: 38, marginRight: 10 },
  nombre: { fontSize: 17, fontFamily: 'Helvetica-Bold' },
  sub: { fontSize: 8, color: c.suave, letterSpacing: 2 },
  derecha: { alignItems: 'flex-end' },
  titulo: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: c.oceano },
  meta: { color: c.suave, marginTop: 2 },
  estado: { marginTop: 6, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  franja: { height: 3, backgroundColor: c.oceano, marginVertical: 18, borderRadius: 2 },
  cols: { flexDirection: 'row', gap: 16 },
  caja: { flex: 1, backgroundColor: c.arena, borderRadius: 6, padding: 10 },
  etiqueta: { fontSize: 7.5, color: c.suave, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 },
  fuerte: { fontFamily: 'Helvetica-Bold' },
  seccion: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 18, marginBottom: 6 },
  tabla: { borderWidth: 1, borderColor: c.borde, borderRadius: 6 },
  thead: { flexDirection: 'row', backgroundColor: c.arena, borderBottomWidth: 1, borderColor: c.borde },
  fila: { flexDirection: 'row', borderBottomWidth: 1, borderColor: c.borde },
  th: { padding: 6, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: c.suave, letterSpacing: 0.5 },
  td: { padding: 6 },
  totales: { marginTop: 16, alignSelf: 'flex-end', width: 230 },
  lineaTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  total: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingTop: 8, borderTopWidth: 1.5, borderColor: c.tinta },
  totalTxt: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  pie: { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderColor: c.borde, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', color: c.suave, fontSize: 7.5 },
});

function Tabla({ columnas, filas }) {
  return (
    <View style={s.tabla}>
      <View style={s.thead}>
        {columnas.map((col) => (
          <Text key={col.titulo} style={[s.th, { flex: col.flex || 1, textAlign: col.derecha ? 'right' : 'left' }]}>{col.titulo.toUpperCase()}</Text>
        ))}
      </View>
      {filas.map((fila, i) => (
        <View key={i} style={[s.fila, i === filas.length - 1 ? { borderBottomWidth: 0 } : {}]}>
          {fila.map((valor, j) => (
            <Text key={j} style={[s.td, { flex: columnas[j].flex || 1, textAlign: columnas[j].derecha ? 'right' : 'left' }]}>{valor}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}
Tabla.propTypes = { columnas: PropTypes.array.isRequired, filas: PropTypes.array.isRequired };

export default function FacturaPDF({ reserva: r }) {
  const habitaciones = r.Habitaciones || [];
  const complementos = r.Complementos || [];
  const huespedes = r.Huespedes || [];
  return (
    <Document title={`Factura reserva ${r.Id}`} author="Travesía Cruceros">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.marca}>
            <Image src={logo} style={s.logo} />
            <View>
              <Text style={s.nombre}>Travesía</Text>
              <Text style={s.sub}>CRUCEROS</Text>
            </View>
          </View>
          <View style={s.derecha}>
            <Text style={s.titulo}>Factura</Text>
            <Text style={s.meta}>Reserva N.º {r.Id}</Text>
            <Text style={s.meta}>Emitida el {fecha(new Date())}</Text>
            <Text style={[s.estado, r.Pagada ? { backgroundColor: '#E3F2EA', color: c.exito } : { backgroundColor: '#FBF0DC', color: '#8A5E08' }]}>
              {r.Pagada ? `PAGADA EL ${fecha(r.FechaPago).toUpperCase()}` : `PENDIENTE · VENCE ${fecha(r.FechaLimitePago).toUpperCase()}`}
            </Text>
          </View>
        </View>

        <View style={s.franja} />

        <View style={s.cols}>
          <View style={s.caja}>
            <Text style={s.etiqueta}>CLIENTE</Text>
            <Text style={s.fuerte}>{r.NombreUsuario}</Text>
            <Text>{r.CorreoUsuario}</Text>
          </View>
          <View style={s.caja}>
            <Text style={s.etiqueta}>VIAJE</Text>
            <Text style={s.fuerte}>{r.NombreCrucero} · {r.NombreBarco}</Text>
            <Text>{fecha(r.FechaSalida)} al {fecha(r.FechaRegreso)} ({r.CantDias} días)</Text>
            <Text>Sale de {r.PuertoSalida} · regresa a {r.PuertoRegreso}</Text>
          </View>
        </View>

        <Text style={s.seccion}>Camarotes</Text>
        <Tabla
          columnas={[{ titulo: 'Tipo', flex: 1.2 }, { titulo: 'Descripción', flex: 3 }, { titulo: 'Pasajeros', flex: 0.9, derecha: true }, { titulo: 'Precio', flex: 1.3, derecha: true }]}
          filas={habitaciones.map((h) => [h.Tipo, h.Descripcion, String(h.CantPasajeros), monto(h.Precio)])}
        />

        {complementos.length > 0 && (
          <>
            <Text style={s.seccion}>Complementos</Text>
            <Tabla
              columnas={[{ titulo: 'Servicio', flex: 3 }, { titulo: 'Cantidad', flex: 0.9, derecha: true }, { titulo: 'Unitario', flex: 1.3, derecha: true }, { titulo: 'Total', flex: 1.3, derecha: true }]}
              filas={complementos.map((x) => [x.Descripcion, String(x.Cantidad), monto(x.PrecioUnitario), monto(x.Total)])}
            />
          </>
        )}

        {huespedes.length > 0 && (
          <>
            <Text style={s.seccion}>Huéspedes</Text>
            <Tabla
              columnas={[{ titulo: 'Nombre', flex: 3 }, { titulo: 'Edad', flex: 0.8, derecha: true }, { titulo: 'Sexo', flex: 0.8, derecha: true }]}
              filas={huespedes.map((h) => [h.Nombre, h.Edad != null ? String(h.Edad) : '-', h.Sexo || '-'])}
            />
          </>
        )}

        <View style={s.totales}>
          <View style={s.lineaTotal}><Text>Camarotes</Text><Text>{monto(r.TotalHabitaciones)}</Text></View>
          <View style={s.lineaTotal}><Text>Complementos</Text><Text>{monto(r.TotalComplementos)}</Text></View>
          <View style={s.lineaTotal}><Text>Subtotal</Text><Text>{monto(r.Subtotal)}</Text></View>
          <View style={s.lineaTotal}><Text>IVA ({r.IVAPorcentaje}%)</Text><Text>{monto(r.IVA)}</Text></View>
          <View style={s.total}><Text style={s.totalTxt}>Total</Text><Text style={s.totalTxt}>{monto(r.Total)}</Text></View>
        </View>

        <View style={s.pie} fixed>
          <Text>Travesía Cruceros · Alajuela, Costa Rica · reservas@travesia.test</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

FacturaPDF.propTypes = {
  reserva: PropTypes.shape({
    Id: PropTypes.number,
    NombreUsuario: PropTypes.string,
    CorreoUsuario: PropTypes.string,
    NombreCrucero: PropTypes.string,
    NombreBarco: PropTypes.string,
    FechaSalida: PropTypes.string,
    FechaRegreso: PropTypes.string,
    FechaLimitePago: PropTypes.string,
    FechaPago: PropTypes.string,
    CantDias: PropTypes.number,
    PuertoSalida: PropTypes.string,
    PuertoRegreso: PropTypes.string,
    Habitaciones: PropTypes.array,
    Complementos: PropTypes.array,
    Huespedes: PropTypes.array,
    TotalHabitaciones: PropTypes.number,
    TotalComplementos: PropTypes.number,
    Subtotal: PropTypes.number,
    IVAPorcentaje: PropTypes.number,
    IVA: PropTypes.number,
    Total: PropTypes.number,
    Pagada: PropTypes.bool,
  }).isRequired,
};
