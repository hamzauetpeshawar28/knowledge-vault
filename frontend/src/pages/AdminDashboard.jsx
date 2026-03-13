import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [tab, setTab]     = useState('books');
  const [hov, setHov]     = useState(null);
  const [form, setForm]   = useState({
    title:'', author:'', description:'', genre:'', category:'',
    language:'English', pages:'', isPremium:false, coverImage:null, pdfFile:null,
  });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try { const { data } = await axios.get('/books'); setBooks(data.books); }
    catch { toast.error('Books load failed!'); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => { if (form[k] !== null) fd.append(k, form[k]); });
      await axios.post('/books', fd, { headers: { 'Content-Type':'multipart/form-data' } });
      toast.success('Book added! ✅');
      fetchBooks();
      setForm({ title:'', author:'', description:'', genre:'', category:'', language:'English', pages:'', isPremium:false, coverImage:null, pdfFile:null });
      setTab('books');
    } catch (err) { toast.error(err.response?.data?.message || 'Error!'); }
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`/books/${id}`); toast.success('Deleted!'); fetchBooks(); }
    catch { toast.error('Delete failed!'); }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.logo}>
            <span style={{fontSize:'20px', color:'var(--gold)'}}>⬡</span>
            <span style={s.logoText}>Knowledge Vault</span>
          </div>
          <div style={s.adminBadge}>👑 Admin Panel</div>
          <nav style={s.nav}>
            {[{id:'books', icon:'📚', label:`All Books (${books.length})`},{id:'add',icon:'➕',label:'Add Book'}].map(item => (
              <button key={item.id} style={{...s.navItem,...(tab===item.id?s.navActive:{})}} onClick={()=>setTab(item.id)}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>↪ Logout</button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {tab === 'books' && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Library</h1>
                <p style={s.pageSub}>{books.length} books total</p>
              </div>
              <button style={s.addBtnTop} onClick={() => setTab('add')}>➕ Add Book</button>
            </div>
            {books.length === 0 ? (
              <div style={s.emptyBox}>
                <span style={{fontSize:'56px'}}>📭</span>
                <p style={s.emptyText}>No books yet — add your first one!</p>
              </div>
            ) : (
              <div style={s.grid}>
                {books.map(book => (
                  <div key={book._id} style={{...s.card,...(hov===book._id?s.cardHov:{})}}
                    onMouseEnter={()=>setHov(book._id)} onMouseLeave={()=>setHov(null)}>
                    {book.coverImage
                      ? <img src={book.coverImage} alt={book.title} style={s.cover} />
                      : <div style={s.coverFb}><span style={{fontSize:'40px'}}>📗</span></div>
                    }
                    <div style={s.cardBody}>
                      <div style={s.cardMeta}>
                        <span style={book.isPremium?s.tagPrem:s.tagFree}>{book.isPremium?'⭐ Premium':'🆓 Free'}</span>
                        <span style={s.tagGenre}>{book.genre}</span>
                      </div>
                      <h4 style={s.cardTitle}>{book.title}</h4>
                      <p style={s.cardAuthor}>{book.author}</p>
                      <p style={s.cardPages}>📄 {book.pages} pages</p>
                      <button style={s.delBtn} onClick={()=>handleDelete(book._id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'add' && (
          <div style={s.formWrap}>
            <h1 style={s.pageTitle}>Add New Book</h1>
            <p style={s.pageSub}>Fill in the details below</p>
            <form onSubmit={handleAdd} style={s.form}>
              <div style={s.formGrid}>
                {[['title','Book Title','e.g. Clean Code'],['author','Author','e.g. Robert C. Martin'],['genre','Genre','e.g. Technology'],['category','Category','e.g. Programming'],['language','Language','e.g. English'],['pages','Pages','e.g. 300']].map(([name,label,ph]) => (
                  <div key={name} style={s.field}>
                    <label style={s.label}>{label}</label>
                    <input style={s.input} name={name} placeholder={ph} value={form[name]} onChange={handleChange} required={['title','author','genre','category'].includes(name)} />
                  </div>
                ))}
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea style={{...s.input, height:'100px', resize:'vertical'}} name="description" placeholder="Book description..." value={form.description} onChange={handleChange} required />
              </div>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>Cover Image</label>
                  <input style={s.input} type="file" accept="image/*" onChange={e=>setForm({...form,coverImage:e.target.files[0]})} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>PDF File</label>
                  <input style={s.input} type="file" accept=".pdf" onChange={e=>setForm({...form,pdfFile:e.target.files[0]})} />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Book Type</label>
                <select style={s.input} name="isPremium" onChange={handleChange}>
                  <option value={false}>🆓 Free</option>
                  <option value={true}>⭐ Premium</option>
                </select>
              </div>
              <div style={s.formActions}>
                <button type="button" style={s.cancelBtn} onClick={()=>setTab('books')}>Cancel</button>
                <button type="submit" style={s.submitBtn}>Add Book →</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

const s = {
  page: { display:'flex', minHeight:'100vh', background:'var(--bg)' },
  sidebar: { width:'260px', background:'var(--navy)', padding:'28px 20px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'sticky', top:0, height:'100vh' },
  logo: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' },
  logoText: { fontFamily:"'Fraunces', serif", fontWeight:700, fontSize:'16px', color:'white' },
  adminBadge: { display:'inline-block', padding:'6px 14px', background:'rgba(201,146,42,0.2)', border:'1px solid rgba(201,146,42,0.4)', borderRadius:'8px', color:'var(--gold)', fontSize:'12px', fontWeight:600, marginBottom:'28px' },
  nav: { display:'flex', flexDirection:'column', gap:'4px' },
  navItem: { display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'10px', background:'transparent', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'14px', fontWeight:500, cursor:'pointer', textAlign:'left' },
  navActive: { background:'rgba(255,255,255,0.08)', color:'white', fontWeight:600 },
  logoutBtn: { padding:'12px', background:'rgba(229,62,62,0.15)', color:'#FC8181', border:'1px solid rgba(229,62,62,0.2)', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer' },
  main: { flex:1, padding:'36px 40px' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px' },
  pageTitle: { fontFamily:"'Fraunces', serif", fontSize:'32px', fontWeight:800, color:'var(--navy)', marginBottom:'4px' },
  pageSub: { color:'var(--text3)', fontSize:'14px' },
  addBtnTop: { padding:'12px 24px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'20px' },
  card: { background:'white', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s', boxShadow:'var(--shadow)' },
  cardHov: { transform:'translateY(-4px)', boxShadow:'var(--shadow-lg)' },
  cover: { width:'100%', height:'160px', objectFit:'cover' },
  coverFb: { width:'100%', height:'160px', background:'linear-gradient(135deg, #F7F5F0, #EEE9DF)', display:'flex', alignItems:'center', justifyContent:'center' },
  cardBody: { padding:'16px' },
  cardMeta: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' },
  tagPrem: { background:'#FEF3C7', color:'#D97706', padding:'3px 8px', borderRadius:'20px', fontSize:'10px', fontWeight:700 },
  tagFree: { background:'#D1FAE5', color:'#065F46', padding:'3px 8px', borderRadius:'20px', fontSize:'10px', fontWeight:700 },
  tagGenre: { color:'var(--text3)', fontSize:'11px' },
  cardTitle: { fontFamily:"'Fraunces', serif", fontSize:'14px', fontWeight:700, color:'var(--navy)', marginBottom:'3px' },
  cardAuthor: { color:'var(--text3)', fontSize:'12px', marginBottom:'4px' },
  cardPages: { color:'var(--text3)', fontSize:'11px', marginBottom:'12px' },
  delBtn: { width:'100%', padding:'8px', background:'#FEF2F2', color:'#EF4444', border:'1px solid #FECACA', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer' },
  emptyBox: { textAlign:'center', padding:'80px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' },
  emptyText: { color:'var(--text3)', fontSize:'15px' },
  formWrap: { maxWidth:'700px' },
  form: { background:'white', border:'1px solid var(--border)', borderRadius:'16px', padding:'36px', marginTop:'24px', boxShadow:'var(--shadow)', display:'flex', flexDirection:'column', gap:'20px' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'13px', fontWeight:600, color:'var(--text2)' },
  input: { padding:'12px 14px', border:'1.5px solid var(--border)', borderRadius:'10px', background:'var(--bg)', fontSize:'14px', color:'var(--text)', outline:'none', width:'100%', boxSizing:'border-box' },
  formActions: { display:'flex', gap:'12px', justifyContent:'flex-end' },
  cancelBtn: { padding:'12px 24px', background:'var(--bg)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer' },
  submitBtn: { padding:'12px 32px', background:'var(--navy)', color:'white', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:700, cursor:'pointer' },
};

export default AdminDashboard;