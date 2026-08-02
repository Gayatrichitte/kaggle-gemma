import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Badge variant="gemma">Powered by Google Gemma</Badge>
          </div>
          <h1 className={styles.heroTitle}>Education Analyzer</h1>
          <p className={styles.heroSubtitle}>
            Smarter Assessments. Powered by Gemma. Elevate your learning and teaching experience with AI-driven insights.
          </p>
          <div className={styles.heroActions}>
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Entry Cards Section */}
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>Choose Your Path</h2>
        <div className={styles.cardsGrid}>
          <Card title="For Teachers" interactive>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Upload student submissions, generate comprehensive feedback, and track class progress automatically.
            </p>
            <Button variant="primary" style={{ width: '100%' }}>Teacher Portal</Button>
          </Card>
          <Card title="For Students" interactive>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Submit assignments, receive instant constructive feedback, and identify areas for improvement.
            </p>
            <Button variant="secondary" style={{ width: '100%' }}>Student Portal</Button>
          </Card>
        </div>
      </section>

      {/* Workflow Section */}
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.workflow}>
          <div className={styles.workflowStep}>
            <div className={styles.stepIcon}>📤</div>
            <h3 className={styles.stepTitle}>1. Upload</h3>
            <p className={styles.stepDesc}>Securely upload assignments and course materials.</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepIcon}>⚙️</div>
            <h3 className={styles.stepTitle}>2. Generate</h3>
            <p className={styles.stepDesc}>Gemma analyzes the content and cross-references learning objectives.</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepIcon}>📊</div>
            <h3 className={styles.stepTitle}>3. Evaluate</h3>
            <p className={styles.stepDesc}>Review detailed reports, scores, and personalized feedback.</p>
          </div>
        </div>
      </section>

      {/* Powered by Gemma Section */}
      <section className={styles.gemmaSection}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Built for the Kaggle Gemma Hackathon</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
            Leveraging the capabilities of Google's open models to create a more efficient, fair, and insightful educational ecosystem.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2026 Education Analyzer Team. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
