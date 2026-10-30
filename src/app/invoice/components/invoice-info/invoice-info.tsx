'use client';

import styles from './invoice-info.module.css';

export function InvoiceInfo() {
  const { currentYear, currentMonth } = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return { currentYear: year, currentMonth: month };
  })();

  const currentDay = '20';
  const dueDay = '28';

  return (
    <div className="space-y-1 text-sm text-slate-700">
      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
        <strong>FACTURA:</strong>
      </p>
      <p className={styles.flex}>
        <strong className="text-slate-900">Nº de factura:</strong>{' '}
        <span contentEditable suppressContentEditableWarning={true} className="focus:bg-amber-50 outline-none font-mono font-semibold">
          {currentYear}F635
        </span>
      </p>
      <p className={styles.flex}>
        <strong className="text-slate-900">Fecha:</strong>{' '}
        <span contentEditable suppressContentEditableWarning={true} className="focus:bg-amber-50 outline-none font-mono">
          {currentDay}/{currentMonth}/{currentYear}
        </span>
      </p>
      <p className={styles.flex}>
        <strong className="text-slate-900">Vencimiento:</strong>{' '}
        <span contentEditable suppressContentEditableWarning={true} className="focus:bg-amber-50 outline-none font-mono">
          {dueDay}/{currentMonth}/{currentYear}
        </span>
      </p>
    </div>
  );
}

export default InvoiceInfo;
