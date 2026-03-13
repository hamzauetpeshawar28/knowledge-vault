import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user }  = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [books, setBooks]   = useState([]);
  const [recs, setRecs]     = useState([]);
  const [popular, setPop]   = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('all');
  const [loading, setLoad]  = useState(true);
  const [hovered, setHov]   = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoad(true);
    await Promise.all([loadBooks(), loadRecs(), loadPop()]);
    setLoad(false);
  };

  const loadBooks = async () => {
    try { const { data } = await axios.get('/books'); setBooks(data.books); }
    catch { toast.error('Books load failed!'); }
  };
  const loadRecs = async () => {
    try { const { data } = await axios.get('/ai/recommendations'); setRecs(data.recommendations); }
    catch {}
  };
  const loadPop = async () => {
    try { const { data } = await axios.get('/ai/popular'); setPop(data.books); }
    catch {}
  };

  const handleDownload = async (book) => {
    if (book.isPremium && user?.subscription === 'free') { navigate('/subscription'); return; }
    try {
      const { data } = await axios.post(`/ai/download/${book._id}`);
      if (data.pdfUrl) {
        window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(data.pdfUrl)}&embedded=true`, '_blank');
        toast.success('Opening PDF! 📖');
      } else {
        toast.warning('PDF not available yet!');
      }
      loadRecs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed!');
    }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const displayed = tab === 'all'
    ? books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    : tab === 'recs' ? recs : popular;

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sideLogo}>
            <span style={{fontSize:'20px', color:'var(--gold)'}}>⬡</span>
            <span style={s.sideLogoText}>Knowledge Vault</span>
          </div>
          <nav style={s.sideNav}>
            {[
              { id:'all',  icon:'📚', label:'All Books' },
              { id:'recs', icon:'🤖', label:'AI Picks' },
              { id:'pop',  icon:'🔥', label:'Trending' },
            ].map(item => (
              <button key={item.id} style={{ ...s.sideNavItem, ...(tab===item.id ? s.sideNavActive : {}) }} onClick={() => setTab(item.id)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div style={s.sideBottom}>
          <button style={s.upgradeBtn} onClick={() => navigate('/subscription')}>
            <span>⭐</span> Upgrade Plan
          </button>
          <div style={s.sideUser}>
            <div style={s.sideAvatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p style={s.sideUserName}>{user?.name}</p>
              <p style={s.sideUserPlan}>{user?.subscription || 'free'} plan</p>
            </div>
            <button style={s.logoutIconBtn} onClick={handleLogout} title="Logout">↪</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>
              {tab === 'all' ? 'Library' : tab === 'recs' ? 'AI Picks' : 'Trending'}
            </h1>
            <p style={s.pageSubtitle}>
              {tab === 'all' ? `${books.length} books available` : tab === 'recs' ? 'Curated just for you' : 'Most downloaded books'}
            </p>
          </div>
          <div style={s.searchBox}>
            <span style={s.searchIcon}>🔍</span>
            <input style={s.searchInput} placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Stats */}
        <div style={s.stats}>
          {[
            { icon:'📖', val: books.length,   lab:'Total Books' },
            { icon:'📥', val: user?.downloadHistory?.length || 0, lab:'Downloads' },
            { icon:'🤖', val: recs.length,     lab:'AI Picks' },
            { icon:'🔥', val: popular.length,  lab:'Trending' },
          ].map((st,i) => (
            <div key={i} style={s.statCard}>
              <span style={s.statIcon}>{st.icon}</span>
              <span style={s.statVal}>{st.val}</span>
              <span style={s.statLab}>{st.lab}</span>
            </div>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div style={s.loadBox}>
            <div style={s.spinner}></div>
            <p style={s.loadText}>Loading books...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div style={s.emptyBox}>
            <span style={s.emptyIcon}>{tab === 'recs' ? '🤖' : '📭'}</span>
            <p style={s.emptyText}>{tab === 'recs' ? 'Download a book — AI will pick recommendations for you!' : 'No books found!'}</p>
          </div>
        ) : (
          <div style={s.grid}>
            {displayed.map(book => (
              <div key={book._id}
                style={{ ...s.card, ...(hovered === book._id ? s.cardHov : {}) }}
                onMouseEnter={() => setHov(book._id)}
                onMouseLeave={() => setHov(null)}
              >
                {book.coverImage
                  ? <img src={book.coverImage} alt={book.title} style={s.cover} />
                  : <div style={s.coverFallback}><span style={{fontSize:'48px'}}>📗</span></div>
                }
                <div style={s.cardBody}>
                  <div style={s.cardMeta}>
                    <span style={book.isPremium ? s.tagPremium : s.tagFree}>
                      {book.isPremium ? '⭐ Premium' : '🆓 Free'}
                    </span>
                    <span style={s.tagGenre}>{book.genre}</span>
                  </div>
                  <h4 style={s.cardTitle}>{book.title}</h4>
                  <p style={s.cardAuthor}>{book.author}</p>
                  <p style={s.cardDesc}>{book.description?.substring(0,72)}...</p>
                  <div style={s.cardFooter}>
                    <span style={s.cardPages}>📄 {book.pages}p</span>
                    <span style={s.cardDownloads}>📥 {book.downloadCount}</span>
                  </div>
                  <button
                    style={book.isPremium && user?.subscription === 'free' ? s.btnLocked : s.btnRead}
                    onClick={() => book.isPremium && user?.subscription === 'free' ? navigate('/subscription') : handleDownload(book)}
                  >
                    {book.isPremium && user?.subscription === 'free' ? '🔒 Unlock Premium' : '📖 Read PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const s = {
  page: { display:'flex', minHeight:'100vh', background:'var(--bg)', fontFamily:"'Plus Jakarta Sans', sans-serif" },
  sidebar: { width:'260px', background:'var(--navy)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'28px 20px', position:'sticky', top:0, height:'100vh', flexShrink:0 },
  sideTop: { display:'flex', flexDirection:'column', gap:'32px' },
  sideLogo: { display:'flex', alignItems:'center', gap:'10px', padding:'0 8px' },
  sideLogoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'16px', color:'white' },
  sideNav: { display:'flex', flexDirection:'column', gap:'4px' },
  sideNavItem: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'10px', background:'transparent', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'14px', fontWeight:500, transition:'all 0.2s', cursor:'pointer', textAlign:'left' },
  sideNavActive: { background:'rgba(255,255,255,0.08)', color:'white', fontWeight:600 },
  sideBottom: { display:'flex', flexDirection:'column', gap:'16px' },
  upgradeBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', background:'var(--gold)', color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
  sideUser: { display:'flex', alignItems:'center', gap:'10px', padding:'12px', background:'rgba(255,255,255,0.06)', borderRadius:'10px' },
  sideAvatar: { width:'36px', height:'36px', background:'var(--gold)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'15px', color:'white', flexShrink:0 },
  sideUserName: { color:'white', fontSize:'13px', fontWeight:600 },
  sideUserPlan: { color:'rgba(255,255,255,0.4)', fontSize:'11px', textTransform:'capitalize' },
  logoutIconBtn: { marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:'18px', cursor:'pointer' },
  main: { flex:1, padding:'36px 40px', overflow:'auto' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'16px' },
  pageTitle: { fontFamily:"'Fraunces', serif", fontSize:'32px', fontWeight:800, color:'var(--navy)', marginBottom:'4px' },
  pageSubtitle: { color:'var(--text3)', fontSize:'14px' },
  searchBox: { display:'flex', alignItems:'center', background:'white', border:'1px solid var(--border)', borderRadius:'10px', padding:'0 16px', gap:'8px', boxShadow:'var(--shadow)' },
  searchIcon: { fontSize:'14px' },
  searchInput: { padding:'12px 0', border:'none', outline:'none', fontSize:'14px', color:'var(--text)', background:'transparent', width:'220px' },
  stats: { display:'flex', gap:'16px', marginBottom:'32px', flexWrap:'wrap' },
  statCard: { background:'white', border:'1px solid var(--border)', borderRadius:'14px', padding:'18px 24px', display:'flex', flexDirection:'column', gap:'4px', flex:1, minWidth:'100px', boxShadow:'var(--shadow)' },
  statIcon: { fontSize:'20px' },
  statVal: { fontFamily:"'Fraunces', serif", fontSize:'24px', fontWeight:800, color:'var(--navy)' },
  statLab: { fontSize:'12px', color:'var(--text3)', fontWeight:500 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'20px' },
  card: { background:'white', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s', boxShadow:'var(--shadow)' },
  cardHov: { transform:'translateY(-4px)', boxShadow:'var(--shadow-lg)' },
  cover: { width:'100%', height:'170px', objectFit:'cover' },
  coverFallback: { width:'100%', height:'170px', background:'linear-gradient(135deg, #F7F5F0, #EEE9DF)', display:'flex', alignItems:'center', justifyContent:'center' },
  cardBody: { padding:'18px' },
  cardMeta: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' },
  tagPremium: { background:'#FEF3C7', color:'#D97706', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700 },
  tagFree: { background:'#D1FAE5', color:'#065F46', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700 },
  tagGenre: { color:'var(--text3)', fontSize:'11px', fontWeight:500 },
  cardTitle: { fontFamily:"'Fraunces', serif", fontSize:'15px', fontWeight:700, color:'var(--navy)', marginBottom:'4px', lineHeight:1.3 },
  cardAuthor: { color:'var(--text3)', fontSize:'12px', marginBottom:'8px' },
  cardDesc: { color:'var(--text2)', fontSize:'12px', lineHeight:1.6, marginBottom:'12px' },
  cardFooter: { display:'flex', justifyContent:'space-between', marginBottom:'14px' },
  cardPages: { fontSize:'11px', color:'var(--text3)' },
  cardDownloads: { fontSize:'11px', color:'var(--text3)' },
  btnRead: { width:'100%', padding:'10px', background:'var(--navy)', color:'white', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:700, cursor:'pointer' },
  btnLocked: { width:'100%', padding:'10px', background:'#FEF3C7', color:'#D97706', border:'1px solid #FDE68A', borderRadius:'8px', fontSize:'13px', fontWeight:700, cursor:'pointer' },
  loadBox: { textAlign:'center', padding:'80px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' },
  spinner: { width:'36px', height:'36px', border:'3px solid var(--border)', borderTop:'3px solid var(--navy)', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  loadText: { color:'var(--text3)', fontSize:'14px' },
  emptyBox: { textAlign:'center', padding:'80px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' },
  emptyIcon: { fontSize:'56px' },
  emptyText: { color:'var(--text3)', fontSize:'15px', maxWidth:'340px' },
};

export default Dashboard;