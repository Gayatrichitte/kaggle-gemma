import React from 'react';
import styles from './components.module.css';

export default function Input({ label, type = 'text', className = '', ...props }) {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <input type={type} className={styles.inputField} {...props} />
    </div>
  );
}
