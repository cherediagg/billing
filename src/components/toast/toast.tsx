'use client';

import styles from './toast.module.css';
import { useState, useEffect } from 'react';

interface ToastProps {
  message?: string | null;
  duration?: number;
}

export function Toast({ message, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(Boolean(message));

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration]);

  if (!isVisible || !message) return null;

  return (
    <div className={styles.toast} role="alert" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">✓</div>
      <div className={styles.message}>{message}</div>
    </div>
  );
}

export default Toast;
