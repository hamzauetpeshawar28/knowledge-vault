import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      dispatch(loginSuccess(data));
      toast.success('Login Successful!');
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1 style={styles.brand}>📚 Knowledge Vault</h1>
        <p style={styles.tagline}>Your gateway to unlimited knowledge</p>
        <div style={styles.perks}>
          <p style={styles.perk}>✅ Free access to thousands of books</p>
          <p style={styles.perk}>✅ AI-powered recommendations</p>
          <p style={styles.perk}>✅ Download & read anywhere</p>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.box}>
          <h2 style={styles.title}>Welcome Back 👋</h2>
          <p style={styles.subtitle}>Login to your account</p>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>
          <p style={styles.link}>
            Don't have an account? <Link to="/register" style={styles.linkBlue}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px',
    borderRight: '1px solid #e2e8f0',
  },
  brand: { fontSize: '32px', color: '#3b82f6', marginBottom: '10px' },
  tagline: { color: '#64748b', fontSize: '16px', marginBottom: '40px' },
  perks: { display: 'flex', flexDirection: 'column', gap: '15px' },
  perk: { color: '#475569', fontSize: '15px' },
  right: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
  box: { width: '100%', maxWidth: '400px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  subtitle: { color: '#64748b', marginBottom: '30px' },
  label: { display: 'block', color: '#475569', fontSize: '13px', marginBottom: '8px', fontWeight: '600' },
  input: {
    width: '100%',
    padding: '13px 15px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  forgotLink: { color: '#3b82f6', fontSize: '13px', textDecoration: 'none', fontWeight: '500' },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
  },
  link: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
  linkBlue: { color: '#3b82f6', textDecoration: 'none', fontWeight: '600' },
};

export default Login;