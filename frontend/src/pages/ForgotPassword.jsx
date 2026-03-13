import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail]   = useState('');
  const [loading, setLoad]  = useState(false);
  const [sent, setSent]     = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error!');
    }
    setLoad(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.logo}>
          <span style={s.logoIcon}>⬡</span>
          <span style={s.logoText}>Knowledge Vault</span>
        </Link>
        {sent ? (
          <div style={s.success}>
            <div style={s.successIcon}>📧</div>
            <h2 style={s.title}>Check your inbox!</h2>
            <p style={s.sub}>We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" style={s.btn}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <h2 style={s.title}>Forgot password?</h2>
            <p style={s.sub}>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={submit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Email address</label>
                <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <button style={{...s.btn, opacity:loading?0.7:1}} type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>
            <p style={s.switchText}>Remember it? <Link to="/login" style={s.link}>Sign in</Link></p>
          </>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'var(--bg)', padding:'20px' },
  card: { background:'white', border:'1px solid var(--border)', borderRadius:'20px', padding:'48px 40px', width:'100%', maxWidth:'420px', boxShadow:'var(--shadow-lg)' },
  logo: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'32px' },
  logoIcon: { fontSize:'20px', color:'var(--navy)' },
  logoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'16px', color:'var(--navy)' },
  title: { fontFamily:"'Fraunces', serif", fontSize:'28px', fontWeight:800, color:'var(--navy)', marginBottom:'8px' },
  sub: { color:'var(--text3)', fontSize:'14px', lineHeight:1.7, marginBottom:'28px' },
  form: { display:'flex', flexDirection:'column', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'13px', fontWeight:600, color:'var(--text2)' },
  input: { padding:'13px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', background:'var(--bg)', fontSize:'14px', outline:'none', color:'var(--text)' },
  btn: { display:'block', textAlign:'center', padding:'14px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:700, cursor:'pointer' },
  switchText: { textAlign:'center', marginTop:'20px', fontSize:'14px', color:'var(--text3)' },
  link: { color:'var(--gold)', fontWeight:600 },
  success: { display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'16px' },
  successIcon: { fontSize:'60px' },
};

export default ForgotPassword;