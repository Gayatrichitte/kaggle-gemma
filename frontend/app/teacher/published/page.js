'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import styles from './published.module.css';

/* ─── Mock test data ─────────────────────────────── */
const TEST_DATA = {
  name: 'Introduction to Photosynthesis',
  subject: 'Biology',
  questions: 8,
  marks: 21,
  duration: 30,
  code: 'GEM-472',
};

/* ─── Confetti particle ──────────────────────────── */
function Particle({ style }) {
  return <div className={styles.particle} style={style} />;
}

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9b59b6', '#2563eb'];
    const shapes = ['square', 'circle', 'rect'];
    const ps = Array.from({ length: 52 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${0.9 + Math.random() * 0.8}s`,
      size: `${6 + Math.floor(Math.random() * 8)}px`,
      rotate: `${Math.random() * 360}deg`,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className={styles.confettiWrap} aria-hidden>
      {particles.map(p => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.shape === 'rect' ? `${parseInt(p.size) * 2}px` : p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '2px',
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated check icon ────────────────────────── */
function CheckIcon() {
  return (
    <div className={styles.checkWrapper}>
      <svg className={styles.checkSvg} viewBox="0 0 52 52" fill="none">
        <circle className={styles.checkCircle} cx="26" cy="26" r="24" stroke="#10b981" strokeWidth="2.5" fill="none" />
        <polyline className={styles.checkMark} points="14,27 22,35 38,19" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

/* ─── Copy button with state ─────────────────────── */
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* fallback – silently fail in non-secure context */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      id="copy-code-btn"
      className={`${styles.actionBtn} ${styles.actionBtnPrimary} ${copied ? styles.actionBtnCopied : ''}`}
      onClick={handleCopy}
    >
      {copied ? (
        <><span className={styles.btnIcon}>✓</span> Copied!</>
      ) : (
        <><span className={styles.btnIcon}>⎘</span> Copy Code</>
      )}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────── */
export default function PublishedPage() {
  const [visible, setVisible] = useState(false);

  /* Trigger entrance animation after mount */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />
      <Confetti />

      <div className={`${styles.container} ${visible ? styles.containerVisible : ''}`}>

        {/* ── Animated success check ── */}
        <CheckIcon />

        {/* ── Header text ── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Test Published!</h1>
          <p className={styles.subtitle}>Your assessment is now live and ready for students.</p>
        </div>

        {/* ── Test details card ── */}
        <div className={styles.detailsCard}>
          <div className={styles.detailsTop}>
            <div>
              <span className={styles.detailsSubject}>{TEST_DATA.subject}</span>
              <h2 className={styles.detailsName}>{TEST_DATA.name}</h2>
            </div>
          </div>
          <div className={styles.detailsPills}>
            <div className={styles.pill}>
              <span className={styles.pillIcon}>❓</span>
              <span className={styles.pillValue}>{TEST_DATA.questions}</span>
              <span className={styles.pillLabel}>Questions</span>
            </div>
            <div className={styles.pillDivider} />
            <div className={styles.pill}>
              <span className={styles.pillIcon}>📊</span>
              <span className={styles.pillValue}>{TEST_DATA.marks}</span>
              <span className={styles.pillLabel}>Marks</span>
            </div>
            <div className={styles.pillDivider} />
            <div className={styles.pill}>
              <span className={styles.pillIcon}>⏱</span>
              <span className={styles.pillValue}>{TEST_DATA.duration}</span>
              <span className={styles.pillLabel}>Minutes</span>
            </div>
          </div>
        </div>

        {/* ── Test Code hero ── */}
        <div className={styles.codeSection}>
          <p className={styles.codeLabel}>Share this code with your students</p>
          <div className={styles.codeCard}>
            <div className={styles.codeGlow} aria-hidden />
            <span className={styles.codeIcon}>🔑</span>
            <div className={styles.codeDigits}>
              {TEST_DATA.code.split('').map((ch, i) => (
                <span
                  key={i}
                  className={ch === '-' ? styles.codeSep : styles.codeChar}
                  style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                >
                  {ch}
                </span>
              ))}
            </div>
            <p className={styles.codeHint}>Students enter this code to access the test</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <CopyButton code={TEST_DATA.code} />

          <Link href="/teacher/create" id="preview-test-link">
            <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
              <span className={styles.btnIcon}>👁</span> Preview Test
            </button>
          </Link>

          <Link href="/teacher" id="go-dashboard-link">
            <button className={`${styles.actionBtn} ${styles.actionBtnGhost}`}>
              <span className={styles.btnIcon}>🏠</span> Go to Dashboard
            </button>
          </Link>
        </div>

        {/* ── Gemma credit ── */}
        <div className={styles.gemmaCredit}>
          <span className={styles.gemmaDot} />
          <span>Assessment generated by <strong>Google Gemma</strong></span>
        </div>

      </div>
    </div>
  );
}
