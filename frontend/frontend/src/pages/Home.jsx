import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={styles.navLogo}>📚 Knowledge Vault</h2>
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navBtn}>Get Started</Link>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.badge}>🚀 Pakistan's #1 Digital Library</div>
        <h1 style={styles.title}>
          Discover & Read <br />
          <span style={styles.highlight}>Unlimited Books</span>
        </h1>
        <p style={styles.subtitle}>
          Search, preview and download thousands of books in one place.
          Powered by AI recommendations just for you.
        </p>
        <div style={styles.buttons}>
          <Link to="/register" style={styles.btnPrimary}>Start Reading Free →</Link>
          <Link to="/login" style={styles.btnSecondary}>Login</Link>
        </div>
      </div>

      <div style={styles.features}>
        {[
          { icon: '🔍', title: 'Smart Search', text: 'Search by title, author, genre or category instantly' },
          { icon: '🤖', title: 'AI Recommendations', text: 'Get personalized book suggestions based on your reading' },
          { icon: '📥', title: 'Easy Downloads', text: 'Download books with one click and read anywhere' },
        ].map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureText}>{f.text}</p>
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        <p>© 2026 Knowledge Vault — Built with MERN Stack</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Segoe UI', sans-serif",
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 60px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  navLogo: { margin: 0, fontSize: '22px', color: '#3b82f6' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '20px' },
  navLink: { color: '#64748b', textDecoration: 'none', fontSize: '15px' },
  navBtn: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
  },
  hero: {
    textAlign: 'center',
    padding: '100px 20px 60px',
    background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    backgroundColor: '#dbeafe',
    border: '1px solid #bfdbfe',
    borderRadius: '50px',
    color: '#3b82f6',
    fontSize: '14px',
    marginBottom: '25px',
    fontWeight: '600',
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px',
    color: '#1e293b',
  },
  highlight: {
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto 40px',
    lineHeight: '1.8',
  },
  buttons: { display: 'flex', gap: '15px', justifyContent: 'center' },
  btnPrimary: {
    padding: '15px 35px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
  },
  btnSecondary: {
    padding: '15px 35px',
    backgroundColor: 'white',
    color: '#3b82f6',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '16px',
    border: '1px solid #bfdbfe',
    fontWeight: '600',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '25px',
    padding: '60px 40px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '35px 30px',
    width: '280px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  featureIcon: { fontSize: '40px', marginBottom: '15px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#1e293b' },
  featureText: { color: '#64748b', lineHeight: '1.7', fontSize: '14px' },
  footer: {
    textAlign: 'center',
    padding: '30px',
    color: '#94a3b8',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: 'white',
  },
};

export default Home;