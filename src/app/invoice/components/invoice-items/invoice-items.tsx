import { useInvoice } from '../../context/invoiceContext';
import styles from './invoice-items.module.css';

export function InvoiceItems() {
  const { items, handleItemChange, addItem, removeItem } = useInvoice();
  const taxRate = 21;

  return (
    <div className="my-6">
      <table className={styles.conceptsTable}>
        <thead>
          <tr>
            <th className="text-left">Concepto</th>
            <th className="text-center w-24">Cantidad</th>
            <th className="text-right w-28">Precio Ud.</th>
            <th className="text-center w-20">IVA (%)</th>
            <th className="text-right w-28">Total</th>
            <th className="w-10 print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const quantity =
              typeof item.quantity === 'number'
                ? item.quantity
                : parseFloat(String(item.quantity)) || 0;
            const price =
              typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price)) || 0;
            const rowTotal = quantity * price * (1 + taxRate / 100);

            return (
              <tr key={item.id || index}>
                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, 'concept', e.currentTarget.textContent || '')
                  }
                  className="font-medium focus:bg-amber-50 outline-none"
                >
                  {item.concept}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, 'quantity', e.currentTarget.textContent || '0')
                  }
                  className="text-center focus:bg-amber-50 outline-none"
                >
                  {item.quantity}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, 'price', e.currentTarget.textContent || '0')
                  }
                  className="text-right focus:bg-amber-50 outline-none font-mono"
                >
                  {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </td>
                <td className="text-center font-mono text-xs text-slate-500">
                  {price ? `${taxRate}%` : '-'}
                </td>
                <td className="text-right font-mono font-semibold">
                  {quantity && price ? `${rowTotal.toFixed(2)} €` : '-'}
                </td>
                <td className="text-center print:hidden">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Eliminar línea"
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-2 print:hidden">
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 py-1 px-2 rounded hover:bg-emerald-50 transition-colors"
        >
          ➕ Añadir línea de concepto
        </button>
      </div>
    </div>
  );
}

export default InvoiceItems;
