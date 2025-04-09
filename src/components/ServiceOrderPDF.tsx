import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ServiceOrder } from '../types';
import { AlignJustify } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000',
    paddingBottom: 6,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 15,
    padding: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 150,
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 6,
    marginBottom: 5,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 4,
  },
  summaryBox: {
    marginTop: 15,
    padding: 6,
    backgroundColor: '#eef2ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#c7d2fe',
  },
  summaryTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  summaryTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#1e40af',
  },
  warrantyBox: {
    marginTop: 20,
    textAlign: 'center',
    padding: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e40af',
    paddingTop: 5,
  }
});

interface ServiceOrderPDFProps {
  serviceOrder: ServiceOrder;
}

export const ServiceOrderPDF = ({ serviceOrder }: ServiceOrderPDFProps) => {
  const calculateTotal = () => {
    const partsTotal = serviceOrder.parts.reduce((sum, part) => {
      const value = typeof part.value === 'number' ? part.value : 0;
      return sum + value;
    }, 0);
    const serviceValue = typeof serviceOrder.serviceValue === 'number' ? serviceOrder.serviceValue : 0;
    return partsTotal + serviceValue;
  };

  const calculatePartsTotal = () => {
    return serviceOrder.parts.reduce((sum, part) => {
      const value = typeof part.value === 'number' ? part.value : 0;
      return sum + value;
    }, 0);
  };

  const getWarrantyDate = () => {
    if (!serviceOrder.exitDate) return '';
    const exitDate = new Date(serviceOrder.exitDate);
    const warrantyDate = new Date(exitDate);
    warrantyDate.setDate(warrantyDate.getDate() + 90);
    return warrantyDate.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number | undefined | null) => {
    const numValue = typeof value === 'number' ? value : 0;
    return `R$ ${numValue.toFixed(2)}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Serviço</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{serviceOrder.client}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Equipamento:</Text>
            <Text style={styles.value}>{serviceOrder.equipment}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{serviceOrder.model}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nº de Série:</Text>
            <Text style={styles.value}>{serviceOrder.serialNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Entrada:</Text>
            <Text style={styles.value}>
              {new Date(serviceOrder.entryDate).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Saída:</Text>
            <Text style={styles.value}>
              {serviceOrder.exitDate ? new Date(serviceOrder.exitDate).toLocaleDateString('pt-BR') : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Defeito Apresentado:</Text>
            <Text style={styles.value}>{serviceOrder.defect}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Solução:</Text>
            <Text style={styles.value}>{serviceOrder.solution}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Técnico Responsável:</Text>
            <Text style={styles.value}>{serviceOrder.technician}</Text>
          </View>
          {serviceOrder.observations && (
            <View style={styles.row}>
              <Text style={styles.label}>Observações:</Text>
              <Text style={styles.value}>{serviceOrder.observations}</Text>
            </View>
          )}
        </View>

        {serviceOrder.parts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peças Utilizadas</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Descrição</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>Valor</Text>
              </View>
              {serviceOrder.parts.map((part, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{part.description}</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                    {formatCurrency(part.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Valores</Text>
          <View style={styles.summaryRow}>
            <Text>Mão de Obra</Text>
            <Text>{formatCurrency(serviceOrder.serviceValue)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Peças e Componentes</Text>
            <Text>{formatCurrency(calculatePartsTotal())}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Valor Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>

        <View style={styles.warrantyBox}>
          <Text style={{ fontFamily: 'Helvetica' }}>
            Garantia 90 dias a partir da data de entrega 
            {serviceOrder.exitDate && (
              <Text>Válida até {getWarrantyDate()}</Text>
            )}
          </Text>
        </View>
        <View style={styles.warrantyBox}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Para pagamentos via Pix, Copie e Cole a CHAVE: d6765eff-2e0e-40c7-a965-2709ef20aca7 em seu banco de preferência e informe o Valor Total acima.
          </Text>
          </View>

        <View style={styles.footer}>
          <Text>#############################</Text>
          <Text>Todos os direitos reservados.</Text>
        </View>
      </Page>
    </Document>
  );
};
