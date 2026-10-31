'use client';

import Loading from 'src/components/loading/loading';
import PrintBtn from 'src/components/print-button/print-btn';
import ErrorAlert from 'src/components/error/error';
import ClientSearch from '../client-search/clientSearch';
import styles from './invoice-content.module.css';
import InvoiceHeader from '../invoice-header/invoice-header';
import ClientInfo from '../client-info/client-info';
import InvoiceInfo from '../invoice-info/invoice-info';
import InvoiceItems from '../invoice-items/invoice-items';
import TotalPrice from '../total-price/total-price';
import PayMethod from '../pay-info/pay-method';
import { useInvoice } from '../../context/invoiceContext';
import { Client } from 'src/models';

export function InvoiceContent() {
  const { clients, loading, error, selectedClient, setSelectedClient } = useInvoice();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <div className={styles.container}>
      <Loading loading={loading} />
      
      <ErrorAlert message={error}>{error}</ErrorAlert>

      {selectedClient && (
        <div>
          <div className={`${styles.clientSearch} flex items-center justify-between gap-4 mb-6 print:hidden`}>
            <ClientSearch
              clients={clients}
              onSelectClient={handleClientSelect}
              selectedClient={selectedClient}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Imprimir / PDF:</span>
              <PrintBtn />
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200/80 print:shadow-none print:border-none print:p-0">
            <InvoiceHeader />

            <div className={styles.clientInfo}>
              <ClientInfo />
              <InvoiceInfo />
            </div>

            <InvoiceItems />
            <TotalPrice />

            <PayMethod />
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceContent;
