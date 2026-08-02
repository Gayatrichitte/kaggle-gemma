import React from 'react';
import styles from './components.module.css';

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className={styles.spinner} />
    </div>
  );
}
