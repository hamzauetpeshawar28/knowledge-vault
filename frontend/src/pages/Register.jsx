import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', form);
      dispatch(loginSuccess(data));
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <Link to="/" style={s.logo}>
          <span style={s.logoIcon}>⬡</span>
          <span style={s.logoText}>Knowledge Vault</span>
        </Link>
        <div style={s.leftContent}>
          <h2 style={s.leftTitle}>Join 1000+<br /><em>readers today.</em></h2>
          <p style={s.leftSub}>Create your free account and start reading in under 60 seconds.</p>
          {['Free forever plan','AI book recommendations','PDF downloads','Premium content available'].map((t,i) => (
            <div key={i} style={s.perk}>
              <span style={s.perkDot}></span>
              <span style={s.perkText}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>Create account</h3>
          <p style={s.cardSub}>It's free — no credit card required</p>
          <form onSubmit={submit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" name="name" placeholder="Hamza Khan" value={form.name} onChange={handle} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required />
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p style={s.switchText}>
            Already a member? <Link to="/login" style={s.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display:'flex', minHeight:'100vh' },
  left: { flex:1, background:'var(--navy)', padding:'40px 60px', display:'flex', flexDirection:'column', gap:'60px' },
  logo: { display:'flex', alignItems:'center', gap:'10px' },
  logoIcon: { fontSize:'22px', color:'var(--gold)' },
  logoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'18px', color:'white' },
  leftContent: { flex:1, display:'flex', flexDirection:'column', justifyContent:'center' },
  leftTitle: { fontFamily:"'Fraunces', serif", fontSize:'52px', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:'20px' },
  leftSub: { fontSize:'15px', color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:'36px', maxWidth:'340px' },
  perk: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' },
  perkDot: { width:'8px', height:'8px', background:'var(--gold)', borderRadius:'50%', flexShrink:0 },
  perkText: { color:'rgba(255,255,255,0.75)', fontSize:'14px' },
  right: { flex:1, display:'flex', justifyContent:'center', alignItems:'center', padding:'40px', background:'var(--bg)' },
  card: { width:'100%', maxWidth:'420px', background:'white', border:'1px solid var(--border)', borderRadius:'20px', padding:'48px 40px', boxShadow:'var(--shadow-lg)' },
  cardTitle: { fontFamily:"'Fraunces', serif", fontSize:'30px', fontWeight:800, color:'var(--navy)', marginBottom:'8px' },
  cardSub: { color:'var(--text3)', fontSize:'14px', marginBottom:'32px' },
  form: { display:'flex', flexDirection:'column', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'13px', fontWeight:600, color:'var(--text2)' },
  input: { padding:'13px 16px', border:'1.5px solid var(--border)', borderRadius:'10px', background:'var(--bg)', fontSize:'14px', color:'var(--text)', outline:'none' },
  btn: { padding:'15px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:700, marginTop:'8px' },
  switchText: { textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--text3)' },
  switchLink: { color:'var(--gold)', fontWeight:600 },
};

export default Register;