import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Subscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

  const subscribe = async (plan) => {
    setLoading(plan);
    try {
      const { data } = await axios.post('/payment/create-checkout', { plan });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment error!');
    }
    setLoading('');
  };

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <div style={s.logo}>
          <span style={{fontSize:'20px', color:'var(--gold)'}}>⬡</span>
          <span style={s.logoText}>Knowledge Vault</span>
        </div>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>← Back to Library</button>
      </div>

      <div style={s.content}>
        <p style={s.tag}>Simple Pricing</p>
        <h1 style={s.title}>Choose your plan</h1>
        <p style={s.subtitle}>Start free, upgrade when you're ready. Cancel anytime.</p>

        <div style={s.cards}>
          {/* Free */}
          <div style={s.card}>
            <p style={s.planName}>Free</p>
            <div style={s.priceRow}>
              <span style={s.price}>$0</span>
              <span style={s.period}>/forever</span>
            </div>
            <p style={s.planDesc}>Perfect for casual readers</p>
            <div style={s.divider}></div>
            <ul style={s.features}>
              {['50 free books','Basic search','Community access'].map((f,i)=>(
                <li key={i} style={s.feature}><span style={s.check}>✓</span>{f}</li>
              ))}
              {['PDF downloads','Premium books','AI recommendations'].map((f,i)=>(
                <li key={i} style={{...s.feature,...s.featureNo}}><span style={s.cross}>✗</span>{f}</li>
              ))}
            </ul>
            <button style={s.btnCurrent} disabled>Current Plan</button>
          </div>

          {/* Monthly — highlighted */}
          <div style={s.cardHL}>
            <div style={s.popularTag}>Most Popular</div>
            <p style={{...s.planName, color:'white'}}>Monthly</p>
            <div style={s.priceRow}>
              <span style={{...s.price, color:'var(--gold-light)'}}>$5</span>
              <span style={{...s.period, color:'rgba(255,255,255,0.5)'}}>/month</span>
            </div>
            <p style={{...s.planDesc, color:'rgba(255,255,255,0.6)'}}>For regular readers</p>
            <div style={{...s.divider, background:'rgba(255,255,255,0.1)'}}></div>
            <ul style={s.features}>
              {['Unlimited books','PDF downloads','AI recommendations','All premium content','Advanced search'].map((f,i)=>(
                <li key={i} style={{...s.feature, color:'rgba(255,255,255,0.85)'}}><span style={{color:'var(--gold-light)'}}>✓</span>{f}</li>
              ))}
            </ul>
            <button style={s.btnHL} onClick={() => subscribe('monthly')} disabled={loading==='monthly'}>
              {loading==='monthly' ? 'Loading...' : 'Subscribe Monthly →'}
            </button>
          </div>

          {/* Yearly */}
          <div style={s.card}>
            <div style={s.saveBadge}>Save 33%</div>
            <p style={s.planName}>Yearly</p>
            <div style={s.priceRow}>
              <span style={s.price}>$40</span>
              <span style={s.period}>/year</span>
            </div>
            <p style={s.planDesc}>Best value for power readers</p>
            <div style={s.divider}></div>
            <ul style={s.features}>
              {['Everything in Monthly','Save $20/year','Priority support','Early access to new books'].map((f,i)=>(
                <li key={i} style={s.feature}><span style={s.check}>✓</span>{f}</li>
              ))}
            </ul>
            <button style={s.btnGold} onClick={() => subscribe('yearly')} disabled={loading==='yearly'}>
              {loading==='yearly' ? 'Loading...' : 'Subscribe Yearly →'}
            </button>
          </div>
        </div>

        <p style={s.footnote}>🔒 Secure payment by Stripe · Cancel anytime · No hidden fees</p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight:'100vh', background:'var(--bg)', fontFamily:"'Plus Jakarta Sans', sans-serif" },
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 60px', background:'white', borderBottom:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  logo: { display:'flex', alignItems:'center', gap:'10px' },
  logoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'18px', color:'var(--navy)' },
  backBtn: { padding:'10px 22px', background:'var(--bg)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'8px', fontSize:'14px', fontWeight:500, cursor:'pointer' },
  content: { padding:'80px 60px', textAlign:'center' },
  tag: { color:'var(--gold)', fontWeight:700, fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px' },
  title: { fontFamily:"'Fraunces', serif", fontSize:'48px', fontWeight:900, color:'var(--navy)', marginBottom:'16px' },
  subtitle: { color:'var(--text2)', fontSize:'16px', marginBottom:'60px' },
  cards: { display:'flex', justifyContent:'center', gap:'24px', flexWrap:'wrap', alignItems:'stretch', maxWidth:'960px', margin:'0 auto' },
  card: { background:'white', border:'1px solid var(--border)', borderRadius:'20px', padding:'40px 32px', width:'280px', textAlign:'left', position:'relative', boxShadow:'var(--shadow)' },
  cardHL: { background:'var(--navy)', border:'none', borderRadius:'20px', padding:'40px 32px', width:'280px', textAlign:'left', position:'relative', boxShadow:'var(--shadow-lg)', transform:'scale(1.04)' },
  popularTag: { position:'absolute', top:'-15px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'white', padding:'6px 20px', borderRadius:'50px', fontSize:'12px', fontWeight:700, whiteSpace:'nowrap' },
  saveBadge: { position:'absolute', top:'-15px', left:'50%', transform:'translateX(-50%)', background:'var(--green)', color:'white', padding:'6px 20px', borderRadius:'50px', fontSize:'12px', fontWeight:700, whiteSpace:'nowrap' },
  planName: { fontFamily:"'Fraunces', serif", fontSize:'22px', fontWeight:800, color:'var(--navy)', marginBottom:'10px' },
  priceRow: { marginBottom:'8px' },
  price: { fontFamily:"'Fraunces', serif", fontSize:'52px', fontWeight:900, color:'var(--navy)' },
  period: { fontSize:'14px', color:'var(--text3)', marginLeft:'4px' },
  planDesc: { color:'var(--text3)', fontSize:'13px', marginBottom:'20px' },
  divider: { height:'1px', background:'var(--border)', marginBottom:'20px' },
  features: { listStyle:'none', display:'flex', flexDirection:'column', gap:'12px', marginBottom:'28px' },
  feature: { display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', color:'var(--text2)' },
  featureNo: { color:'var(--text3)' },
  check: { color:'var(--green)', fontWeight:700 },
  cross: { color:'var(--text3)' },
  btnCurrent: { width:'100%', padding:'13px', background:'var(--bg)', color:'var(--text3)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'not-allowed' },
  btnHL: { width:'100%', padding:'13px', background:'var(--gold)', color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(201,146,42,0.4)' },
  btnGold: { width:'100%', padding:'13px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
  footnote: { marginTop:'48px', color:'var(--text3)', fontSize:'13px' },
};

export default Subscription;