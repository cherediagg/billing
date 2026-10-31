import type { Metadata } from 'next';
import { InvoiceProvider } from './context/invoiceContext';
import InvoiceContent from './components/invoice-content/invoice-content';

export const metadata: Metadata = {
  title: 'Generar Factura Individual | eBilling',
  description: 'Emisión, cálculo detallado e impresión de facturas individuales para clientes',
};

export default function InvoicePage() {
  return (
    <InvoiceProvider>
      <InvoiceContent />
    </InvoiceProvider>
  );
}
