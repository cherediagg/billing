'use client';

import { InvoiceProvider } from './context/invoiceContext';
import InvoiceContent from './components/invoice-content/invoice-content';

export default function InvoicePage() {
  return (
    <InvoiceProvider>
      <InvoiceContent />
    </InvoiceProvider>
  );
}
