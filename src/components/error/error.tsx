import { useEffect, useState } from 'react';
import styles from './error.module.css';

interface ErrorProps {
  message: string | null;
  children: React.ReactNode
}

export function Error({message, children}: ErrorProps) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
  }, [message]);

  const closeError = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className={styles.error} role="alert">
      <div 
        onClick={closeError} 
        className={styles.close}
        role="button"
        aria-label="Cerrar mensaje de error"
      >
        &times;
      </div>
      {children}
    </div>
  );
}

export default Error;
