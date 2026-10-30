import { APP_CONFIG } from 'src/lib/config';
import styles from './pay-method.module.css';

export function PayMethod() {
  return (
    <div className={styles.paymentMethod}>
      <p className="text-sm text-slate-700">
        <strong className="text-slate-900">Método de Pago: </strong>
        <span contentEditable suppressContentEditableWarning={true} className="focus:bg-amber-50 outline-none">
          Transferencia bancaria al número de cuenta {APP_CONFIG.company.bankAccount}
        </span>
      </p>
    </div>
  );
}

export default PayMethod;
