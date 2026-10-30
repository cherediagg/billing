'use client';

import { useState } from 'react';
import styles from './text-input.module.css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
}

export function TextInput({
  label,
  id,
  error,
  required = false,
  className = '',
  onBlur,
  placeholder,
  ...props
}: TextInputProps) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (required && !e.target.value.trim()) {
      setLocalError(`Campo obligatorio`);
    } else {
      setLocalError('');
    }
    if (onBlur) onBlur(e);
  };

  const displayError = error || localError;
  const dynamicPlaceholder = placeholder || `Enter ${label.toLowerCase()}`;

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        className={`${styles.input} ${displayError ? styles.errorInput : ''} ${className}`}
        placeholder={dynamicPlaceholder}
        aria-invalid={!!displayError}
        aria-required={required}
        aria-describedby={displayError ? `${id}-error` : undefined}
        onBlur={handleBlur}
        {...props}
      />
      {displayError && touched && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {displayError}
        </span>
      )}
    </div>
  );
}

export default TextInput;
