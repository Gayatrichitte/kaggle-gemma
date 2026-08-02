import React from 'react';
import styles from './components.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {title && <h2 style={{ marginBottom: '1rem' }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
