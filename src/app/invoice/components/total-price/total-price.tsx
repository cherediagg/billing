import { useInvoice } from '../../context/invoiceContext';
import styles from './total-price.module.css';

export function TotalPrice() {
  const { totals } = useInvoice();

  return (
    <table className={styles.footerTable}>
      <tbody>
        <tr>
          <th>Base Imponible:</th>
          <td id="base-imponible">{totals.baseImponible.toFixed(2)} €</td>
        </tr>
        <tr>
          <th>IVA (21%):</th>
          <td id="iva">{totals.iva.toFixed(2)} €</td>
        </tr>
        <tr className={styles.totaltr}>
          <th className={styles.totalth}>TOTAL:</th>
          <td id="total" className="font-bold text-emerald-700">
            {totals.total.toFixed(2)} €
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default TotalPrice;
