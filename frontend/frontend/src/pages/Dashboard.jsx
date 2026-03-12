import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [popular, setPopular] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBooks(), fetchRecommendations(), fetchPopular()]);
    setLoading(false);
  };

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get('/books');
      setBooks(data.books);
    } catch (error) {
      toast.error('Books load nahi hue!');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data } = await axios.get('/ai/recommendations');
      setRecommendations(data.recommendations);
    } catch (error) {
      console.log('Recommendations error:', error);
    }
  };

  const fetchPopular = async () => {
    try {
      const { data } = await axios.get('/ai/popular');
      setPopular(data.books);
    } catch (error) {
      console.log('Popular error:', error);
    }
  };

  const handleDownload = async (book) => {
    try {
      if (book.isPremium && user?.subscription === 'free') {
        navigate('/subscription');
        return;
      }
      const { data } = await axios.post(`/ai/download/${book._id}`);
      if (data.pdfUrl && data.pdfUrl !== '') {
        // Google Docs Viewer se PDF browser mein open hoga
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(data.pdfUrl)}&embedded=true`;
        window.open(viewerUrl, '_blank');
        toast.success('PDF khul raha hai! 📖');
      } else {
        toast.warning('Is book ka PDF upload nahi kiya gaya!');
      }
      fetchRecommendations();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Premium subscription chahiye!');
        navigate('/subscription');
      } else {
        toast.error(error.response?.data?.message || 'Download failed!');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out!');
    navigate('/login');
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const displayBooks = activeTab === 'all' ? filtered :
    activeTab === 'recommended' ? recommendations : popular;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>📚 Knowledge Vault</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>👋 {user?.name}</span>
          <span style={user?.subscription !== 'free' ? styles.premiumBadge : styles.freeBadge}>
            {user?.subscription !== 'free' ? '⭐ Premium' : 'Free'}
          </span>
          <button style={styles.upgradeBtn} onClick={() => navigate('/subscription')}>
            ⭐ Upgrade
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Welcome Banner */}
        <div style={styles.banner}>
          <div>
            <h2 style={styles.bannerTitle}>Welcome back, {user?.name}! 👋</h2>
            <p style={styles.bannerSubtitle}>Discover your next favorite book today</p>
          </div>
          <div style={styles.bannerIcon}>📚</div>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          {[
            { num: books.length, label: 'Total Books', icon: '📖' },
            { num: user?.downloadHistory?.length || 0, label: 'Downloaded', icon: '📥' },
            { num: recommendations.length, label: 'AI Picks', icon: '🤖' },
            { num: popular.length, label: 'Trending', icon: '🔥' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <h3 style={styles.statNum}>{stat.num}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.search}
            placeholder="Search books by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { id: 'all', label: '📚 All Books' },
            { id: 'recommended', label: '🤖 AI Picks' },
            { id: 'popular', label: '🔥 Trending' },
          ].map((tab) => (
            <button
              key={tab.id}
              style={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading books...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {displayBooks.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>
                  {activeTab === 'recommended' ? '🤖' : '📭'}
                </div>
                <p style={styles.emptyText}>
                  {activeTab === 'recommended'
                    ? 'Download a book — AI will pick recommendations for you!'
                    : 'No books found!'}
                </p>
              </div>
            ) : (
              displayBooks.map((book) => (
                <div
                  key={book._id}
                  style={{
                    ...styles.card,
                    ...(hoveredCard === book._id ? styles.cardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(book._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={styles.coverImg} />
                  ) : (
                    <div style={styles.coverPlaceholder}>
                      <span style={styles.placeholderIcon}>📗</span>
                    </div>
                  )}
                  <div style={styles.cardBody}>
                    <div style={styles.cardTop}>
                      <span style={book.isPremium ? styles.premium : styles.freeTag}>
                        {book.isPremium ? '⭐ Premium' : '🆓 Free'}
                      </span>
                      <span style={styles.genre}>{book.genre}</span>
                    </div>
                    <h4 style={styles.cardTitle}>{book.title}</h4>
                    <p style={styles.cardAuthor}>✍️ {book.author}</p>
                    <p style={styles.cardDesc}>
                      {book.description?.substring(0, 75)}...
                    </p>
                    <div style={styles.cardFooter}>
                      <span style={styles.pages}>📄 {book.pages} pages</span>
                      <span style={styles.downloads}>📥 {book.downloadCount}</span>
                    </div>
                    <button
                      style={book.isPremium && user?.subscription === 'free'
                        ? styles.lockedBtn : styles.downloadBtn}
                      onClick={() => book.isPremium && user?.subscription === 'free'
                        ? navigate('/subscription') : handleDownload(book)}
                    >
                      {book.isPremium && user?.subscription === 'free'
                        ? '🔒 Unlock Premium' : '📖 Read PDF'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontFamily: "'Segoe UI', sans-serif",
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { color: '#3b82f6', margin: 0, fontSize: '20px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  welcome: { color: '#64748b', fontSize: '14px' },
  premiumBadge: {
    background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
    color: '#7c3aed',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    border: '1px solid #c4b5fd',
    fontWeight: '600',
  },
  freeBadge: {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  upgradeBtn: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
  },
  logoutBtn: {
    padding: '8px 18px',
    backgroundColor: '#fff1f2',
    color: '#f43f5e',
    border: '1px solid #fecdd3',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  content: { padding: '30px 40px' },
  banner: {
    background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
    border: '1px solid #dbeafe',
    borderRadius: '16px',
    padding: '28px 35px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
    animation: 'fadeIn 0.5s ease',
  },
  bannerTitle: { fontSize: '22px', fontWeight: '700', margin: '0 0 6px', color: '#1e293b' },
  bannerSubtitle: { color: '#64748b', margin: 0, fontSize: '14px' },
  bannerIcon: { fontSize: '48px', animation: 'float 3s ease-in-out infinite' },
  stats: { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
  statCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px 25px',
    textAlign: 'center',
    flex: '1',
    minWidth: '120px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  statIcon: { fontSize: '22px', marginBottom: '6px' },
  statNum: { fontSize: '24px', fontWeight: '800', color: '#3b82f6', margin: '0 0 4px' },
  statLabel: { color: '#94a3b8', margin: 0, fontSize: '12px' },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0 18px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  searchIcon: { fontSize: '16px', marginRight: '10px' },
  search: {
    flex: 1,
    padding: '14px 0',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1e293b',
    fontSize: '15px',
    outline: 'none',
  },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
  tab: {
    padding: '10px 22px',
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  tabActive: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
  },
  loadingBox: { textAlign: 'center', padding: '80px' },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    margin: '0 auto 15px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: { color: '#94a3b8' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    animation: 'fadeIn 0.5s ease',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'transform 0.25s, box-shadow 0.25s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
    borderColor: '#bfdbfe',
  },
  coverImg: { width: '100%', height: '180px', objectFit: 'cover' },
  coverPlaceholder: {
    width: '100%',
    height: '180px',
    background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: { fontSize: '60px' },
  cardBody: { padding: '18px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  premium: {
    background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
    color: '#7c3aed',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid #c4b5fd',
  },
  freeTag: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid #bbf7d0',
  },
  genre: { color: '#3b82f6', fontSize: '11px', fontWeight: '600' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 5px', lineHeight: '1.4' },
  cardAuthor: { color: '#64748b', fontSize: '12px', margin: '0 0 8px' },
  cardDesc: { color: '#94a3b8', fontSize: '12px', margin: '0 0 12px', lineHeight: '1.6' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', marginBottom: '14px' },
  pages: { color: '#94a3b8', fontSize: '11px' },
  downloads: { color: '#94a3b8', fontSize: '11px' },
  downloadBtn: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
  },
  lockedBtn: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #faf5ff, #eff6ff)',
    color: '#7c3aed',
    border: '1px solid #c4b5fd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  emptyBox: { gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '60px', marginBottom: '15px' },
  emptyText: { color: '#94a3b8', fontSize: '16px' },
};

export default Dashboard;