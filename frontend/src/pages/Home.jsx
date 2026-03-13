import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <div style={s.navLogo}>
          <span style={s.logoIcon}>⬡</span>
          <span style={s.logoText}>Knowledge Vault</span>
        </div>
        <div style={s.navLinks}>
          <Link to="/login" style={s.navLink}>Sign In</Link>
          <Link to="/register" style={s.navBtn}>Start Free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>📚 Pakistan's #1 Digital Library</div>
          <h1 style={s.heroTitle}>
            Read Without<br />
            <em style={s.heroItalic}>Limits.</em>
          </h1>
          <p style={s.heroSub}>
            Thousands of books, AI-curated for you. Download PDFs,
            discover new genres, and grow your knowledge — all in one place.
          </p>
          <div style={s.heroBtns}>
            <Link to="/register" style={s.btnPrimary}>Get Started Free →</Link>
            <Link to="/login" style={s.btnGhost}>Already a member?</Link>
          </div>
          <div style={s.heroStats}>
            {[['1000+','Books'], ['AI','Powered'], ['PDF','Downloads'], ['Free','Forever']].map(([n,l],i) => (
              <div key={i} style={s.stat}>
                <span style={s.statNum}>{n}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={s.heroDeco}>
          <div style={s.decoCard1}>
            <span style={{fontSize:'40px'}}>📖</span>
            <p style={s.decoTitle}>Clean Code</p>
            <p style={s.decoAuthor}>Robert C. Martin</p>
          </div>
          <div style={s.decoCard2}>
            <span style={{fontSize:'40px'}}>🧠</span>
            <p style={{...s.decoTitle, color:'white'}}>Deep Work</p>
            <p style={{...s.decoAuthor, color:'rgba(255,255,255,0.5)'}}>Cal Newport</p>
          </div>
          <div style={s.decoCard3}>
            <span style={{fontSize:'40px'}}>⚛️</span>
            <p style={s.decoTitle}>Atomic Habits</p>
            <p style={s.decoAuthor}>James Clear</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        <p style={s.sectionTag}>Why Knowledge Vault?</p>
        <h2 style={s.sectionTitle}>Everything you need to read more</h2>
        <div style={s.featureGrid}>
          {[
            { icon:'🔍', title:'Smart Search', text:'Find any book by title, author, genre or category in milliseconds.' },
            { icon:'🤖', title:'AI Recommendations', text:'Our engine learns your taste and serves up exactly what you want to read next.' },
            { icon:'📥', title:'PDF Downloads', text:'Download any book as a PDF and read it anywhere, on any device.' },
            { icon:'⭐', title:'Premium Library', text:'Unlock thousands of premium books with a single affordable subscription.' },
            { icon:'🔐', title:'Secure & Private', text:'JWT authentication and encrypted data keep your account safe.' },
            { icon:'💳', title:'Easy Payments', text:'Subscribe monthly or yearly via Stripe — cancel anytime, no questions asked.' },
          ].map((f,i) => (
            <div key={i} style={s.featureCard}>
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={s.pricing}>
        <p style={s.sectionTag}>Simple Pricing</p>
        <h2 style={s.sectionTitle}>Start free, upgrade anytime</h2>
        <div style={s.pricingGrid}>
          {[
            { name:'Free', price:'$0', period:'forever', features:['50 free books','Basic search','Community access'], cta:'Start Free', link:'/register', highlight:false },
            { name:'Monthly', price:'$5', period:'/month', features:['Unlimited books','PDF downloads','AI recommendations','All premium content'], cta:'Subscribe Monthly', link:'/register', highlight:true },
            { name:'Yearly', price:'$40', period:'/year', features:['Everything in Monthly','Save 33%','Priority support','Early access'], cta:'Subscribe Yearly', link:'/register', highlight:false },
          ].map((p,i) => (
            <div key={i} style={{ ...s.pricingCard, ...(p.highlight ? s.pricingHighlight : {}) }}>
              {p.highlight && <div style={s.popularBadge}>Most Popular</div>}
              <h3 style={{ ...s.planName, ...(p.highlight ? { color:'white' } : {}) }}>{p.name}</h3>
              <div style={s.planPrice}>
                <span style={{ ...s.planAmt, ...(p.highlight ? { color:'white' } : {}) }}>{p.price}</span>
                <span style={{ ...s.planPeriod, ...(p.highlight ? { color:'rgba(255,255,255,0.6)' } : {}) }}>{p.period}</span>
              </div>
              <ul style={s.planFeatures}>
                {p.features.map((f,j) => (
                  <li key={j} style={{ ...s.planFeature, ...(p.highlight ? { color:'rgba(255,255,255,0.85)' } : {}) }}>
                    <span style={{ color: p.highlight ? '#F0D9A8' : 'var(--gold)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={p.link} style={{ ...s.planCta, ...(p.highlight ? s.planCtaHighlight : {}) }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={s.team}>
        <p style={s.teamTag}>Meet the Team</p>
        <h2 style={s.teamTitle}>The minds behind Knowledge Vault</h2>
        <div style={s.teamGrid}>
          {[
            {
              name: 'Hamza Khan',
              role: 'Lead Developer',
              img: '/hamza.jpg',
              desc: 'Full-stack MERN developer & project lead. Built the entire backend, AI engine, and system architecture.',
            },
            {
              name: 'Muhammad Saad Shakeel',
              role: 'Frontend Developer',
              img: '/saad.jpg',
              desc: 'UI/UX designer and React specialist. Crafted the user interface and experience design.',
            },
            {
              name: 'Ilham Raza',
              role: 'Backend Developer',
              img: '/ilham.jpg',
              desc: 'Database architect and API developer. Handled MongoDB, authentication, and deployment.',
            },
          ].map((dev, i) => (
            <div key={i} style={s.devCard}>
              <div style={s.devImgWrap}>
                <img
                  src={dev.img}
                  alt={dev.name}
                  style={s.devImg}
                  onError={(e) => { e.target.style.display='none'; }}
                />
                <div style={s.devImgRing}></div>
              </div>
              <h3 style={s.devName}>{dev.name}</h3>
              <p style={s.devRole}>{dev.role}</p>
              <div style={s.devDivider}></div>
              <p style={s.devDesc}>{dev.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>
          <span style={s.logoIcon}>⬡</span>
          <span style={{...s.logoText, color:'white'}}>Knowledge Vault</span>
        </div>
        <p style={s.footerText}>© 2026 Knowledge Vault — Built with MERN Stack by Hamza Khan, Muhammad Saad Shakeel & Ilham Raza</p>
      </footer>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0) rotate(3deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes float3 {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const s = {
  page: { minHeight:'100vh', background:'var(--bg)', overflow:'hidden' },

  /* Navbar */
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 60px', position:'fixed', top:0, left:0, right:0, zIndex:100, transition:'all 0.3s ease' },
  navScrolled: { background:'rgba(247,245,240,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)', boxShadow:'var(--shadow)' },
  navLogo: { display:'flex', alignItems:'center', gap:'10px' },
  logoIcon: { fontSize:'22px', color:'var(--navy)' },
  logoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'18px', color:'var(--navy)' },
  navLinks: { display:'flex', alignItems:'center', gap:'20px' },
  navLink: { color:'var(--text2)', fontSize:'14px', fontWeight:500 },
  navBtn: { padding:'10px 24px', background:'var(--navy)', color:'white', borderRadius:'8px', fontSize:'14px', fontWeight:600 },

  /* Hero */
  hero: { minHeight:'100vh', display:'flex', alignItems:'center', padding:'120px 60px 80px', gap:'60px', background:'linear-gradient(135deg, #F7F5F0 0%, #EEE9DF 100%)', flexWrap:'wrap' },
  heroInner: { flex:1, maxWidth:'560px', animation:'fadeUp 0.7s ease forwards' },
  heroTag: { display:'inline-block', padding:'7px 16px', background:'var(--gold-light)', border:'1px solid var(--gold)', borderRadius:'50px', fontSize:'13px', fontWeight:600, color:'var(--gold)', marginBottom:'24px' },
  heroTitle: { fontSize:'72px', fontWeight:900, color:'var(--navy)', marginBottom:'24px', lineHeight:1.05 },
  heroItalic: { fontStyle:'italic', color:'var(--gold)' },
  heroSub: { fontSize:'17px', color:'var(--text2)', lineHeight:1.8, marginBottom:'36px', maxWidth:'460px' },
  heroBtns: { display:'flex', gap:'16px', marginBottom:'48px', flexWrap:'wrap' },
  btnPrimary: { padding:'15px 32px', background:'var(--navy)', color:'white', borderRadius:'10px', fontSize:'15px', fontWeight:700, boxShadow:'0 4px 16px rgba(13,27,42,0.25)' },
  btnGhost: { padding:'15px 28px', background:'transparent', color:'var(--navy)', border:'2px solid var(--navy)', borderRadius:'10px', fontSize:'15px', fontWeight:600 },
  heroStats: { display:'flex', gap:'32px', flexWrap:'wrap' },
  stat: { display:'flex', flexDirection:'column', gap:'2px' },
  statNum: { fontFamily:"'Fraunces', serif", fontSize:'28px', fontWeight:700, color:'var(--navy)' },
  statLabel: { fontSize:'12px', color:'var(--text3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' },
  heroDeco: { flex:1, position:'relative', height:'420px', minWidth:'300px', display:'flex', alignItems:'center', justifyContent:'center' },
  decoCard1: { position:'absolute', top:'20px', left:'20px', background:'white', borderRadius:'16px', padding:'24px', boxShadow:'var(--shadow-lg)', textAlign:'center', width:'160px', animation:'float 4s ease-in-out infinite' },
  decoCard2: { position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'var(--navy)', borderRadius:'16px', padding:'28px', boxShadow:'var(--shadow-lg)', textAlign:'center', width:'170px', zIndex:2, animation:'float2 5s ease-in-out infinite' },
  decoCard3: { position:'absolute', bottom:'20px', right:'20px', background:'white', borderRadius:'16px', padding:'24px', boxShadow:'var(--shadow-lg)', textAlign:'center', width:'160px', animation:'float3 3.5s ease-in-out infinite' },
  decoTitle: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'14px', marginTop:'10px', color:'var(--navy)' },
  decoAuthor: { fontSize:'11px', color:'var(--text3)', marginTop:'4px' },

  /* Features */
  features: { padding:'100px 60px', background:'white' },
  sectionTag: { textAlign:'center', color:'var(--gold)', fontWeight:600, fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px' },
  sectionTitle: { textAlign:'center', fontSize:'40px', fontWeight:800, color:'var(--navy)', marginBottom:'60px' },
  featureGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'24px', maxWidth:'1000px', margin:'0 auto' },
  featureCard: { padding:'32px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'16px' },
  featureIcon: { fontSize:'32px', marginBottom:'16px' },
  featureTitle: { fontFamily:"'Fraunces', serif", fontSize:'18px', fontWeight:700, color:'var(--navy)', marginBottom:'10px' },
  featureText: { fontSize:'14px', color:'var(--text2)', lineHeight:1.7 },

  /* Pricing */
  pricing: { padding:'100px 60px', background:'var(--bg)' },
  pricingGrid: { display:'flex', justifyContent:'center', gap:'24px', flexWrap:'wrap', maxWidth:'1000px', margin:'0 auto' },
  pricingCard: { background:'white', border:'1px solid var(--border)', borderRadius:'20px', padding:'40px 32px', width:'280px', position:'relative', boxShadow:'var(--shadow)' },
  pricingHighlight: { background:'var(--navy)', border:'none', boxShadow:'var(--shadow-lg)' },
  popularBadge: { position:'absolute', top:'-14px', left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'white', padding:'6px 20px', borderRadius:'50px', fontSize:'12px', fontWeight:700, whiteSpace:'nowrap' },
  planName: { fontFamily:"'Fraunces', serif", fontSize:'22px', fontWeight:700, color:'var(--navy)', marginBottom:'12px' },
  planPrice: { marginBottom:'24px' },
  planAmt: { fontSize:'48px', fontWeight:800, fontFamily:"'Fraunces', serif", color:'var(--navy)' },
  planPeriod: { fontSize:'14px', color:'var(--text3)', marginLeft:'4px' },
  planFeatures: { listStyle:'none', marginBottom:'28px', display:'flex', flexDirection:'column', gap:'12px' },
  planFeature: { fontSize:'14px', color:'var(--text2)', display:'flex', gap:'8px', alignItems:'center' },
  planCta: { display:'block', textAlign:'center', padding:'13px', background:'var(--bg)', color:'var(--navy)', border:'2px solid var(--border)', borderRadius:'10px', fontSize:'14px', fontWeight:700 },
  planCtaHighlight: { background:'var(--gold)', border:'2px solid var(--gold)', color:'white' },

  /* Team */
  team: { padding:'100px 60px', background:'var(--navy)' },
  teamTag: { textAlign:'center', color:'var(--gold)', fontWeight:600, fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px' },
  teamTitle: { textAlign:'center', fontFamily:"'Fraunces', serif", fontSize:'40px', fontWeight:800, color:'white', marginBottom:'60px' },
  teamGrid: { display:'flex', justifyContent:'center', gap:'28px', flexWrap:'wrap', maxWidth:'1000px', margin:'0 auto' },
  devCard: {
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'24px',
    padding:'40px 28px',
    width:'280px',
    textAlign:'center',
    backdropFilter:'blur(10px)',
  },
  devImgWrap: { position:'relative', width:'110px', height:'110px', margin:'0 auto 20px' },
  devImg: {
    width:'110px',
    height:'110px',
    borderRadius:'50%',
    objectFit:'cover',
    objectPosition:'top',
    border:'3px solid var(--gold)',
    display:'block',
  },
  devImgRing: {
    position:'absolute',
    inset:'-6px',
    borderRadius:'50%',
    border:'2px dashed rgba(201,146,42,0.4)',
    animation:'spin 12s linear infinite',
  },
  devName: { fontFamily:"'Fraunces', serif", fontSize:'19px', fontWeight:800, color:'white', marginBottom:'6px' },
  devRole: { color:'var(--gold)', fontSize:'12px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'16px' },
  devDivider: { height:'1px', background:'rgba(255,255,255,0.08)', marginBottom:'14px' },
  devDesc: { color:'rgba(255,255,255,0.5)', fontSize:'13px', lineHeight:1.8 },

  /* Footer */
  footer: { padding:'40px 60px', background:'#060E1A', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' },
  footerLogo: { display:'flex', alignItems:'center', gap:'10px' },
  footerText: { color:'rgba(255,255,255,0.3)', fontSize:'13px' },
};

export default Home;