import styles from './loading.module.css';

interface LoadingProps {
  loading: boolean;
  message?: string;
}

export function Loading({loading, message = 'Cargando'}: LoadingProps) {
  
  if(!loading) return null;

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      {message}
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
}

export default Loading;
