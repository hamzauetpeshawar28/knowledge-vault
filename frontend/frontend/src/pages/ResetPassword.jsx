import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords match nahi kar rahe!');
    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset ho gaya!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.logo}>📚 Knowledge Vault</h2>
        <h3 style={styles.title}>Set New Password 🔑</h3>
        <p style={styles.subtitle}>Enter a strong new password</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>New Password</label>
          <input style={styles.input} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label style={styles.label}>Confirm Password</label>
          <input style={styles.input} type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" },
  box: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '50px 40px', width: '420px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  logo: { color: '#3b82f6', marginBottom: '25px' },
  title: { color: '#1e293b', fontSize: '24px', marginBottom: '10px', fontWeight: '700' },
  subtitle: { color: '#64748b', marginBottom: '25px' },
  label: { display: 'block', color: '#475569', fontSize: '13px', marginBottom: '8px', textAlign: 'left', fontWeight: '600' },
  input: { width: '100%', padding: '13px 15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' },
};

export default ResetPassword;