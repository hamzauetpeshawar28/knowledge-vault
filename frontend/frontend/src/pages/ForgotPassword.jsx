import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email bhej diya!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.logo}>📚 Knowledge Vault</h2>
        {sent ? (
          <div style={styles.success}>
            <div style={styles.successIcon}>📧</div>
            <h3 style={styles.title}>Email Sent!</h3>
            <p style={styles.subtitle}>Check your email — reset link has been sent!</p>
            <Link to="/login" style={styles.backBtn}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <h3 style={styles.title}>Forgot Password 🔐</h3>
            <p style={styles.subtitle}>Enter your email — we'll send a reset link!</p>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button style={styles.button} type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>
            <p style={styles.link}>
              Remember it? <Link to="/login" style={styles.linkBlue}>Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" },
  box: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '50px 40px', width: '420px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  logo: { color: '#3b82f6', marginBottom: '25px' },
  title: { color: '#1e293b', fontSize: '24px', marginBottom: '10px', fontWeight: '700' },
  subtitle: { color: '#64748b', marginBottom: '25px', lineHeight: '1.6' },
  label: { display: 'block', color: '#475569', fontSize: '13px', marginBottom: '8px', textAlign: 'left', fontWeight: '600' },
  input: { width: '100%', padding: '13px 15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' },
  link: { marginTop: '20px', color: '#64748b', fontSize: '14px' },
  linkBlue: { color: '#3b82f6', textDecoration: 'none', fontWeight: '600' },
  success: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  successIcon: { fontSize: '60px', marginBottom: '20px' },
  backBtn: { marginTop: '20px', color: '#3b82f6', textDecoration: 'none', fontWeight: '600' },
};

export default ForgotPassword;