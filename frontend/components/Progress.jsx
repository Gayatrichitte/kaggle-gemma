import React from 'react';
import styles from './components.module.css';

export default function Progress({ value = 0 }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressBar} style={{ width: `${safeValue}%` }} />
    </div>
  );
}
