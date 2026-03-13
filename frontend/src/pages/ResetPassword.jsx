import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const [pass, setPass]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoad]    = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pass !== confirm) return toast.error('Passwords do not match!');
    setLoad(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password: pass });
      toast.success('Password reset!');
      navigate('/login');
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
        <h2 style={s.title}>Set new password</h2>
        <p style={s.sub}>Choose a strong password for your account.</p>
        <form onSubmit={submit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>New Password</label>
            <input style={s.input} type="password" placeholder="Min 6 characters" value={pass} onChange={e=>setPass(e.target.value)} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input style={s.input} type="password" placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          </div>
          <button style={{...s.btn, opacity:loading?0.7:1}} type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>
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
  sub: { color:'var(--text3)', fontSize:'14px', marginBottom:'28px' },
  form: { display:'flex', flexDirection:'column', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'13px', fontWeight:600, color:'var(--text2)' },
  input: { padding:'13px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', background:'var(--bg)', fontSize:'14px', outline:'none', color:'var(--text)' },
  btn: { padding:'14px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:700, cursor:'pointer' },
};

export default ResetPassword;