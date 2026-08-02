import React from 'react';
import styles from './components.module.css';

export default function Card({ children, title, interactive = false, className = '', ...props }) {
  const interactiveClass = interactive ? styles.cardInteractive : '';
  return (
    <div className={`${styles.card} ${interactiveClass} ${className}`} {...props}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {children}
    </div>
  );
}
