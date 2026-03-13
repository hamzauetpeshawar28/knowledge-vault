import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const plan      = params.get('plan');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post('/payment/verify', { plan });
        const stored = JSON.parse(localStorage.getItem('user'));
        dispatch(loginSuccess({
          token: localStorage.getItem('token'),
          user: { ...stored, subscription: data.subscription },
        }));
        toast.success('Subscription activated! 🎉');
      } catch { toast.error('Verification failed!'); }
    };
    if (plan) verify();
  }, [plan]);

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🎉</div>
        <h1 style={s.title}>Payment Successful!</h1>
        <p style={s.sub}>Your <strong style={{color:'var(--gold)'}}>{plan}</strong> subscription is now active. Enjoy unlimited access to the library!</p>
        <div style={s.checks}>
          {['Unlimited books unlocked','PDF downloads enabled','AI recommendations active'].map((c,i)=>(
            <div key={i} style={s.check}><span style={s.checkIcon}>✓</span>{c}</div>
          ))}
        </div>
        <button style={s.btn} onClick={() => navigate('/dashboard')}>Go to Library →</button>
      </div>
    </div>
  );
};

const s = {
  page: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'var(--bg)' },
  card: { background:'white', border:'1px solid var(--border)', borderRadius:'24px', padding:'60px 50px', textAlign:'center', maxWidth:'460px', boxShadow:'var(--shadow-lg)' },
  icon: { fontSize:'72px', marginBottom:'20px' },
  title: { fontFamily:"'Fraunces', serif", fontSize:'34px', fontWeight:900, color:'var(--navy)', marginBottom:'14px' },
  sub: { color:'var(--text2)', fontSize:'15px', lineHeight:1.7, marginBottom:'28px' },
  checks: { display:'flex', flexDirection:'column', gap:'12px', marginBottom:'36px', textAlign:'left' },
  check: { display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'var(--text2)' },
  checkIcon: { color:'var(--green)', fontWeight:700, fontSize:'16px' },
  btn: { padding:'15px 40px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(13,27,42,0.2)' },
};

export default PaymentSuccess;