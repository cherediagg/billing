import { useInvoice } from '../../context/invoiceContext';

export function ClientInfo() {
  const { selectedClient } = useInvoice();

  if (!selectedClient) return null;

  return (
    <div className="space-y-1 text-sm text-slate-700">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        Cliente
      </p>
      <div className="font-bold text-base text-slate-900">{selectedClient.name}</div>
      <div>
        <span className="text-slate-500">NIF/CIF:</span> {selectedClient.taxId}
      </div>
      <div>{selectedClient.address}</div>
      <div>{selectedClient.city}</div>
    </div>
  );
}

export default ClientInfo;
