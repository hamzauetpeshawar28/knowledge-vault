import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Subscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

  const handleSubscribe = async (plan) => {
    setLoading(plan);
    try {
      const { data } = await axios.post('/payment/create-checkout', { plan });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment error!');
    }
    setLoading('');
  };

  return (
    <div style={styles.container}>
      {/* Background Glow */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>📚 Knowledge Vault</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>⭐ Premium Plans</div>
          <h2 style={styles.title}>Choose Your Plan</h2>
          <p style={styles.subtitle}>
            Unlock unlimited books, AI recommendations & PDF downloads
          </p>
        </div>

        {/* Plans */}
        <div style={styles.plans}>
          {/* Free Plan */}
          <div style={styles.planCard}>
            <div style={styles.planIcon}>📖</div>
            <h3 style={styles.planName}>Free</h3>
            <div style={styles.priceBox}>
              <span style={styles.amount}>$0</span>
              <span style={styles.period}>/forever</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>50 Free Books</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Basic Search</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkNo}>✗</span>
                <span style={styles.disabled}>PDF Download</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkNo}>✗</span>
                <span style={styles.disabled}>AI Recommendations</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkNo}>✗</span>
                <span style={styles.disabled}>Premium Books</span>
              </div>
            </div>
            <button style={styles.currentBtn} disabled>
              Current Plan
            </button>
          </div>

          {/* Monthly Plan */}
          <div style={styles.popularCard}>
            <div style={styles.popularBadge}>🔥 Most Popular</div>
            <div style={styles.planIcon}>📚</div>
            <h3 style={styles.planName}>Monthly</h3>
            <div style={styles.priceBox}>
              <span style={{ ...styles.amount, color: '#4f8ef7' }}>$5</span>
              <span style={styles.period}>/month</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Unlimited Books</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Advanced Search</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>PDF Download</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>AI Recommendations</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>All Premium Books</span>
              </div>
            </div>
            <button
              style={styles.subscribeBtn}
              onClick={() => handleSubscribe('monthly')}
              disabled={loading === 'monthly'}
            >
              {loading === 'monthly' ? '⏳ Loading...' : 'Subscribe Monthly →'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div style={styles.planCard}>
            <div style={styles.saveBadge}>💰 Save 33%</div>
            <div style={styles.planIcon}>🏆</div>
            <h3 style={styles.planName}>Yearly</h3>
            <div style={styles.priceBox}>
              <span style={{ ...styles.amount, color: '#a855f7' }}>$40</span>
              <span style={styles.period}>/year</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Unlimited Books</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Advanced Search</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>PDF Download</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>AI Recommendations</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkYes}>✓</span>
                <span>Priority Support</span>
              </div>
            </div>
            <button
              style={styles.subscribeYearlyBtn}
              onClick={() => handleSubscribe('yearly')}
              disabled={loading === 'yearly'}
            >
              {loading === 'yearly' ? '⏳ Loading...' : 'Subscribe Yearly →'}
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <p style={styles.note}>
          🔒 Secure payment powered by Stripe · Cancel anytime
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#060818',
    color: 'white',
    fontFamily: "'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'fixed',
    top: '-200px',
    left: '-200px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'fixed',
    bottom: '-200px',
    right: '-200px',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 40px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { color: '#4f8ef7', margin: 0 },
  backBtn: {
    padding: '9px 20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '60px 40px',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 0.6s ease',
  },
  header: { textAlign: 'center', marginBottom: '60px' },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    backgroundColor: 'rgba(79,142,247,0.1)',
    border: '1px solid rgba(79,142,247,0.2)',
    borderRadius: '50px',
    color: '#4f8ef7',
    fontSize: '14px',
    marginBottom: '20px',
  },
  title: { fontSize: '42px', fontWeight: '800', margin: '0 0 15px' },
  subtitle: { color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto' },
  plans: {
    display: 'flex',
    justifyContent: 'center',
    gap: '25px',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '40px 30px',
    width: '280px',
    textAlign: 'center',
    position: 'relative',
  },
  popularCard: {
    background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(168,85,247,0.08))',
    border: '1px solid rgba(79,142,247,0.3)',
    borderRadius: '20px',
    padding: '40px 30px',
    width: '280px',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 0 40px rgba(79,142,247,0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
    color: 'white',
    padding: '6px 22px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  saveBadge: {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(168,85,247,0.2)',
    color: '#a855f7',
    border: '1px solid rgba(168,85,247,0.3)',
    padding: '6px 22px',
    borderRadius: '20px',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  planIcon: { fontSize: '45px', marginBottom: '15px' },
  planName: { fontSize: '22px', fontWeight: '700', margin: '0 0 15px' },
  priceBox: { marginBottom: '20px' },
  amount: { fontSize: '48px', fontWeight: '800' },
  period: { color: '#64748b', fontSize: '14px', marginLeft: '5px' },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    margin: '20px 0',
  },
  features: { marginBottom: '30px', textAlign: 'left' },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#cbd5e1',
  },
  checkYes: { color: '#4f8ef7', fontWeight: '700', fontSize: '16px' },
  checkNo: { color: '#475569', fontWeight: '700', fontSize: '16px' },
  disabled: { color: '#475569' },
  currentBtn: {
    width: '100%',
    padding: '13px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#475569',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontSize: '15px',
    cursor: 'not-allowed',
  },
  subscribeBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(79,142,247,0.3)',
  },
  subscribeYearlyBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #a855f7, #4f8ef7)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  note: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '13px',
    marginTop: '40px',
  },
};

export default Subscription;