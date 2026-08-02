import React from 'react';
import styles from './components.module.css';

export default function EmptyState({ message = 'No data available', icon = '📊' }) {
  return (
    <div className={styles.emptyState}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <p>{message}</p>
    </div>
  );
}
