import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from "./images/thanos.png"

// Estilos del PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  headerText: {
    flex: 1
  },
  section: { marginBottom: 10 },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  table: { display: 'table', width: '100%', borderWidth: 1, borderStyle: 'solid', borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableCellHeader: { padding: 5, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#000', textAlign: 'right' },
  tableCell: { padding: 5, borderBottomWidth: 1, borderBottomColor: '#ddd', textAlign: 'right' },
  textBold: { fontWeight: 'bold' },
  textLeft: { textAlign: 'left' },
  priceCell: { padding: 5, textAlign: 'right', width: 100 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { textAlign: 'left' },
  summaryValue: { textAlign: 'right', width: 100 },
  paymentStatus: { 
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10
  },
  paymentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  paymentStatusText: {
    textAlign: 'center',
    width: '100%',
    marginBottom: 4
  },
  paymentPending: { color: '#d35400', fontWeight: 'bold' },
  paymentCompleted: { color: '#27ae60', fontWeight: 'bold' },
  amountDue: {
    fontWeight: 'bold',
    textAlign: 'right'
  },
  logo: {
    width: 80,
    height: 40,
    marginLeft: 10
  },
  contactSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contactColumn: {
    width: '48%'
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50'
  },
  contactItem: {
    marginBottom: 5
  }
});

// Importa tu logo (asegúrate de que la ruta sea correcta)


const InvoicePDF = ({ data }) => {
  const fechaEmision = new Date().toLocaleDateString();
  const paymentDueDate = new Date(data.FechaLimitePago).toLocaleDateString();
  const isPaid = data.EstadoPago !== '0';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con logo */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Factura de Reserva #{data.Id}</Text>
            <Text>Fecha de emisión: {fechaEmision}</Text>
          </View>
          <Image style={styles.logo} src={logo} />
        </View>

        {/* Información del cliente y crucero */}
        <View style={styles.section}>
          <Text><Text style={styles.textBold}>Nombre:</Text> {data.NombreUsuario}</Text>
          <Text><Text style={styles.textBold}>Crucero:</Text> {data.NombreCrucero}</Text>
          <Text><Text style={styles.textBold}>Puerto de Salida:</Text> {data.PuertoSalida}</Text>
          <Text><Text style={styles.textBold}>Puerto de Regreso:</Text> {data.PuertoRegreso}</Text>
          <Text>
            <Text style={styles.textBold}>Salida:</Text> {new Date(data.FechaSalida).toLocaleDateString()} {' - '}
            <Text style={styles.textBold}>Regreso:</Text> {new Date(data.FechaRegreso).toLocaleDateString()}
          </Text>
        </View>

        {/* Estado de pago */}
        <View style={styles.paymentStatus}>
          <Text style={[
            styles.paymentStatusText,
            isPaid ? styles.paymentCompleted : styles.paymentPending
          ]}>
            {isPaid ? 'PAGO COMPLETADO' : `PENDIENTE DE PAGO - VENCE EL ${paymentDueDate}`}
          </Text>
          
          {!isPaid && (
            <View style={styles.paymentInfoRow}>
              <Text style={styles.textBold}>Restante por pagar:</Text>
              <Text style={styles.amountDue}>${data.PrecioTotal.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Tabla de Habitaciones */}
        <View style={styles.section}>
          <Text style={styles.textBold}>Habitaciones</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellHeader, styles.textLeft, { flex: 3 }]}>Nombre</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Huéspedes</Text>
              <Text style={[styles.tableCellHeader, { width: 100 }]}>Precio</Text>
            </View>
            {data.InfoHabitaciones.map((habitacion, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, styles.textLeft, { flex: 3 }]}>{habitacion.NombreHabitacion}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{habitacion.CantidadHuespedes}</Text>
                <Text style={[styles.tableCell, styles.priceCell]}>${habitacion.PrecioHabitacion.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabla de Complementos */}
        <View style={styles.section}>
          <Text style={styles.textBold}>Servicios Adicionales</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellHeader, styles.textLeft, { flex: 3 }]}>Servicio</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Cantidad</Text>
              <Text style={[styles.tableCellHeader, { width: 100 }]}>Precio Total</Text>
            </View>
            {data.InfoComplementos.map((complemento, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, styles.textLeft, { flex: 3 }]}>{complemento.NombreComplemento}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{complemento.CantidadComplemento}</Text>
                <Text style={[styles.tableCell, styles.priceCell]}>${complemento.PrecioTotal.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Resumen de Pagos */}
        <View style={styles.section}>
          <Text style={styles.textBold}>Resumen de Pagos</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Habitaciones:</Text>
            <Text style={styles.summaryValue}>${data.PrecioTotalHabitacione.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Servicios:</Text>
            <Text style={styles.summaryValue}>${(data.PrecioFinal - data.PrecioTotalHabitacione).toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>SubTotal:</Text>
            <Text style={styles.summaryValue}>${data.PrecioFinal.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>IVA ({data.IVA}%):</Text>
            <Text style={styles.summaryValue}>${(data.PrecioFinal * data.IVA / 100).toLocaleString()}</Text>
          </View>
          
          <View style={[styles.summaryItem, { marginTop: 8 }]}>
            <Text style={[styles.textBold, styles.summaryLabel]}>Total:</Text>
            <Text style={[styles.textBold, styles.summaryValue]}>${data.PrecioTotal.toLocaleString()}</Text>
          </View>
        </View>

         {/* Sección de contacto */}
         <View style={styles.contactSection}>
          <View style={styles.contactColumn}>
            <Text style={styles.contactTitle}>INFORMACIÓN DE CONTACTO</Text>
            <Text style={styles.contactItem}>Teléfono: +506 2222-2222</Text>
            <Text style={styles.contactItem}>WhatsApp: +506 8888-8888</Text>
            <Text style={styles.contactItem}>Email: info@cruceros.com</Text>
          </View>
          
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;