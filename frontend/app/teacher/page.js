'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Progress from '../../components/Progress';
import styles from './teacher.module.css';

const RECENT_TESTS = [
  { id: 1, title: 'Introduction to Photosynthesis', subject: 'Biology', date: 'Jul 30, 2026', status: 'published', students: 28, avgScore: 74 },
  { id: 2, title: 'Newton\'s Laws of Motion', subject: 'Physics', date: 'Jul 28, 2026', status: 'draft', students: 0, avgScore: null },
  { id: 3, title: 'World War II – Key Events', subject: 'History', date: 'Jul 25, 2026', status: 'published', students: 32, avgScore: 82 },
  { id: 4, title: 'Quadratic Equations', subject: 'Mathematics', date: 'Jul 22, 2026', status: 'published', students: 25, avgScore: 68 },
];

const PUBLISHED_TESTS = RECENT_TESTS.filter(t => t.status === 'published');

const STUDENT_OVERVIEW = [
  { name: 'Aryan Mehta', score: 88, test: 'Introduction to Photosynthesis' },
  { name: 'Priya Nair', score: 76, test: 'Newton\'s Laws of Motion' },
  { name: 'Rohan Das', score: 92, test: 'World War II – Key Events' },
  { name: 'Sneha Iyer', score: 61, test: 'Quadratic Equations' },
  { name: 'Karan Joshi', score: 84, test: 'Introduction to Photosynthesis' },
];

export default function TeacherDashboard() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            <a href="/teacher" className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className={styles.navIcon}>🏠</span> Dashboard
            </a>
            <a href="/teacher/create" className={styles.navItem}>
              <span className={styles.navIcon}>➕</span> Create Test
            </a>
            <a href="#" className={styles.navItem}>
              <span className={styles.navIcon}>📋</span> My Tests
            </a>
            <a href="#" className={styles.navItem}>
              <span className={styles.navIcon}>👩‍🎓</span> Students
            </a>
            <a href="#" className={styles.navItem}>
              <span className={styles.navIcon}>📊</span> Analytics
            </a>
            <a href="#" className={styles.navItem}>
              <span className={styles.navIcon}>⚙️</span> Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Welcome Banner */}
          <section className={styles.welcome}>
            <div className={styles.welcomeText}>
              <h1>Welcome back, Ms. Gayatri 👋</h1>
              <p className={styles.welcomeSub}>Here's what's happening with your assessments today.</p>
            </div>
            <Link href="/teacher/create">
              <Button variant="primary" id="create-test-btn">+ Create New Test</Button>
            </Link>
          </section>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📄</span>
              <div>
                <div className={styles.statValue}>12</div>
                <div className={styles.statLabel}>Total Tests</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>✅</span>
              <div>
                <div className={styles.statValue}>9</div>
                <div className={styles.statLabel}>Published</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>👩‍🎓</span>
              <div>
                <div className={styles.statValue}>85</div>
                <div className={styles.statLabel}>Total Students</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📈</span>
              <div>
                <div className={styles.statValue}>75%</div>
                <div className={styles.statLabel}>Avg Score</div>
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Recent Tests */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Tests</h2>
              <div className={styles.testList}>
                {RECENT_TESTS.map(test => (
                  <div key={test.id} className={styles.testItem}>
                    <div className={styles.testInfo}>
                      <span className={styles.testTitle}>{test.title}</span>
                      <span className={styles.testMeta}>{test.subject} · {test.date}</span>
                    </div>
                    <div className={styles.testRight}>
                      <span className={test.status === 'published' ? styles.badgePublished : styles.badgeDraft}>
                        {test.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Student Performance Overview */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Student Performance</h2>
              <div className={styles.studentList}>
                {STUDENT_OVERVIEW.map((s, i) => (
                  <div key={i} className={styles.studentItem}>
                    <div className={styles.studentAvatar}>{s.name.charAt(0)}</div>
                    <div className={styles.studentInfo}>
                      <span className={styles.studentName}>{s.name}</span>
                      <span className={styles.studentTest}>{s.test}</span>
                      <Progress value={s.score} />
                    </div>
                    <span className={`${styles.studentScore} ${s.score >= 80 ? styles.scoreHigh : s.score >= 65 ? styles.scoreMid : styles.scoreLow}`}>
                      {s.score}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Published Tests */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Published Tests</h2>
            <div className={styles.publishedGrid}>
              {PUBLISHED_TESTS.map(test => (
                <div key={test.id} className={styles.publishedCard}>
                  <div className={styles.publishedTop}>
                    <Badge variant="neutral">{test.subject}</Badge>
                    <span className={styles.publishedDate}>{test.date}</span>
                  </div>
                  <h3 className={styles.publishedTitle}>{test.title}</h3>
                  <div className={styles.publishedMeta}>
                    <span>👩‍🎓 {test.students} students</span>
                    <span>📊 Avg: {test.avgScore}%</span>
                  </div>
                  <Progress value={test.avgScore} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
