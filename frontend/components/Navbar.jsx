import React from 'react';
import Link from 'next/link';
import styles from './components.module.css';
import Badge from './Badge';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navBrand}>
        Education Analyzer
      </Link>
      <div className={styles.navLinks}>
        <Link href="/teacher" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          Teacher Portal
        </Link>
        <Badge variant="gemma">Powered by Gemma</Badge>
      </div>
    </nav>
  );
}
