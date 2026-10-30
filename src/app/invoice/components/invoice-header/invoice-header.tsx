import Image from 'next/image';
import { APP_CONFIG } from 'src/lib/config';
import styles from './invoice-header.module.css';

export function InvoiceHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Logo de la Empresa" width={180} height={60} priority />
      </div>
      <div className={styles.companyDetails}>
        <p>
          <strong className="text-slate-900 font-bold">{APP_CONFIG.company.name}</strong>
        </p>
        <div className="text-sm text-slate-600">NIF: {APP_CONFIG.company.taxId}</div>
        <div className="text-sm text-slate-600">{APP_CONFIG.company.address}</div>
        <div className="text-sm text-slate-600">{APP_CONFIG.company.city}</div>
        <div className="text-sm text-slate-600">Telf. {APP_CONFIG.company.phone}</div>
      </div>
    </div>
  );
}

export default InvoiceHeader;
