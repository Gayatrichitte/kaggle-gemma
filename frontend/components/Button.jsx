import React from 'react';
import styles from './components.module.css';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const btnClass = variant === 'primary' ? styles.btnPrimary : styles.btnSecondary;
  return (
    <button className={`${styles.button} ${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
