import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('books');
  const [formData, setFormData] = useState({
    title: '', author: '', description: '',
    genre: '', category: '', language: 'English',
    pages: '', isPremium: false,
    coverImage: null, pdfFile: null,
  });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get('/books');
      setBooks(data.books);
    } catch (error) {
      toast.error('Books load nahi hue!');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('author', formData.author);
      form.append('description', formData.description);
      form.append('genre', formData.genre);
      form.append('category', formData.category);
      form.append('language', formData.language);
      form.append('pages', formData.pages);
      form.append('isPremium', formData.isPremium);
      if (formData.coverImage) form.append('coverImage', formData.coverImage);
      if (formData.pdfFile) form.append('pdfFile', formData.pdfFile);

      await axios.post('/books', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Book add ho gayi! ✅');
      fetchBooks();
      setFormData({ title: '', author: '', description: '', genre: '', category: '', language: 'English', pages: '', isPremium: false, coverImage: null, pdfFile: null });
      setActiveTab('books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      toast.success('Book delete ho gayi!');
      fetchBooks();
    } catch (error) {
      toast.error('Delete nahi hua!');
    }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>📚 Knowledge Vault</h2>
        <div style={styles.navCenter}>
          <button style={activeTab === 'books' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('books')}>📚 Books</button>
          <button style={activeTab === 'add' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('add')}>➕ Add Book</button>
        </div>
        <div style={styles.navRight}>
          <span style={styles.adminBadge}>👑 Admin</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {activeTab === 'books' && (
          <>
            <div style={styles.header}>
              <h2 style={styles.heading}>All Books</h2>
              <span style={styles.count}>{books.length} Total</span>
            </div>
            <div style={styles.grid}>
              {books.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={styles.empty}>No books yet — Add Book tab se add karo!</p>
                </div>
              ) : (
                books.map((book) => (
                  <div key={book._id} style={styles.card}>
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} style={styles.coverImg} />
                    ) : (
                      <div style={styles.coverPlaceholder}>📗</div>
                    )}
                    <div style={styles.cardBody}>
                      <div style={styles.cardTop}>
                        <span style={book.isPremium ? styles.premium : styles.free}>
                          {book.isPremium ? '⭐ Premium' : '🆓 Free'}
                        </span>
                        <span style={styles.genre}>{book.genre}</span>
                      </div>
                      <h4 style={styles.cardTitle}>{book.title}</h4>
                      <p style={styles.cardAuthor}>✍️ {book.author}</p>
                      <p style={styles.cardPages}>📄 {book.pages} pages</p>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(book._id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'add' && (
          <div style={styles.formContainer}>
            <h2 style={styles.heading}>➕ Add New Book</h2>
            <form onSubmit={handleAddBook} style={styles.form}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Book Title</label>
                  <input style={styles.input} name="title" placeholder="e.g. Clean Code" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                  <label style={styles.label}>Author Name</label>
                  <input style={styles.input} name="author" placeholder="e.g. Robert C. Martin" value={formData.author} onChange={handleChange} required />
                </div>
                <div>
                  <label style={styles.label}>Genre</label>
                  <input style={styles.input} name="genre" placeholder="e.g. Technology" value={formData.genre} onChange={handleChange} required />
                </div>
                <div>
                  <label style={styles.label}>Category</label>
                  <input style={styles.input} name="category" placeholder="e.g. Programming" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                  <label style={styles.label}>Language</label>
                  <input style={styles.input} name="language" placeholder="e.g. English" value={formData.language} onChange={handleChange} />
                </div>
                <div>
                  <label style={styles.label}>Pages</label>
                  <input style={styles.input} name="pages" type="number" placeholder="e.g. 300" value={formData.pages} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Description</label>
                <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} name="description" placeholder="Book description..." value={formData.description} onChange={handleChange} required />
              </div>
              <div>
                <label style={styles.label}>Cover Image</label>
                <input style={styles.input} type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, coverImage: e.target.files[0] })} />
              </div>
              <div>
                <label style={styles.label}>PDF File</label>
                <input style={styles.input} type="file" accept=".pdf" onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })} />
              </div>
              <div>
                <label style={styles.label}>Book Type</label>
                <select style={styles.input} name="isPremium" onChange={handleChange}>
                  <option value={false}>🆓 Free</option>
                  <option value={true}>⭐ Premium</option>
                </select>
              </div>
              <button style={styles.addBtn} type="submit">➕ Add Book</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { color: '#3b82f6', margin: 0 },
  navCenter: { display: 'flex', gap: '10px' },
  tab: { padding: '9px 20px', backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  tabActive: { padding: '9px 20px', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminBadge: { background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', color: '#7c3aed', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #c4b5fd' },
  logoutBtn: { padding: '8px 20px', backgroundColor: '#fff1f2', color: '#f43f5e', border: '1px solid #fecdd3', borderRadius: '8px', cursor: 'pointer' },
  content: { padding: '35px 40px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  heading: { fontSize: '24px', fontWeight: '700', margin: 0, color: '#1e293b' },
  count: { backgroundColor: '#dbeafe', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  coverImg: { width: '100%', height: '160px', objectFit: 'cover' },
  coverPlaceholder: { width: '100%', height: '160px', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
  cardBody: { padding: '18px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 5px' },
  cardAuthor: { color: '#64748b', fontSize: '12px', margin: '0 0 4px' },
  cardPages: { color: '#94a3b8', fontSize: '12px', margin: '0 0 12px' },
  deleteBtn: { width: '100%', padding: '8px', backgroundColor: '#fff1f2', color: '#f43f5e', border: '1px solid #fecdd3', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  premium: { background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', color: '#7c3aed', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: '1px solid #c4b5fd' },
  free: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: '1px solid #bbf7d0' },
  genre: { color: '#3b82f6', fontSize: '11px', fontWeight: '600' },
  emptyBox: { gridColumn: '1/-1', textAlign: 'center', padding: '60px' },
  empty: { color: '#94a3b8', fontSize: '16px' },
  formContainer: { maxWidth: '700px', margin: '0 auto' },
  form: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  label: { display: 'block', color: '#475569', fontSize: '13px', marginBottom: '8px', fontWeight: '600' },
  input: { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  addBtn: { padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' },
};

export default AdminDashboard;