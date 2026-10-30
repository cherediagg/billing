import React from 'react';
import styles from './button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'success';
  isDisabled?: boolean;
  ariaLabel?: string;
}

export function Button({
  variant = 'primary',
  isDisabled = false,
  ariaLabel,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const effectiveAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);

  const buttonClass = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'error' && styles.error,
    isDisabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClass}
      aria-label={effectiveAriaLabel}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
