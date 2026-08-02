import React from 'react';
import styles from './components.module.css';

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const badgeClass = variant === 'gemma' ? styles.badgeGemma : styles.badgeNeutral;
  return (
    <span className={`${styles.badge} ${badgeClass} ${className}`}>
      {children}
    </span>
  );
}
