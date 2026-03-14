import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPosts = (url = 'api/posts/') => {
    setLoading(true);
    const relativeUrl = url.replace('http://127.0.0.1:8000/', '');
    API.get(relativeUrl)
      .then(res => {
        setPosts(res.data.results ?? res.data);
        setNextPage(res.data.next || null);
        setPrevPage(res.data.previous || null);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const url = search ? `api/posts/?search=${encodeURIComponent(search)}` : 'api/posts/';
    fetchPosts(url);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f8f7f4; }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-18px) scale(1.03); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-title   { animation: heroFadeUp 0.7s 0.1s ease both; }
        .hero-sub     { animation: heroFadeUp 0.7s 0.25s ease both; }
        .hero-search  { animation: heroFadeUp 0.7s 0.4s ease both; }
        .hero-cta     { animation: heroFadeUp 0.7s 0.55s ease both; }
        .hero-blob1   { animation: blobFloat 8s ease-in-out infinite; }
        .hero-blob2   { animation: blobFloat 11s ease-in-out infinite reverse; }
        .hero-blob3   { animation: blobFloat 6s ease-in-out infinite 2s; }

        .post-grid-item { animation: cardFadeIn 0.5s ease both; }
        .post-grid-item:nth-child(1) { animation-delay: 0.05s; }
        .post-grid-item:nth-child(2) { animation-delay: 0.12s; }
        .post-grid-item:nth-child(3) { animation-delay: 0.19s; }
        .post-grid-item:nth-child(4) { animation-delay: 0.26s; }
        .post-grid-item:nth-child(5) { animation-delay: 0.33s; }
        .post-grid-item:nth-child(6) { animation-delay: 0.40s; }

        .search-input {
          border-radius: 50px 0 0 50px !important;
          padding: 13px 22px !important;
          border: none !important;
          font-size: 0.95rem !important;
          box-shadow: none !important;
        }
        .search-btn {
          background: #e0c97f !important;
          color: #1a1a2e !important;
          font-weight: 700 !important;
          border-radius: 0 50px 50px 0 !important;
          padding: 13px 26px !important;
          border: none !important;
          transition: background 0.2s !important;
        }
        .search-btn:hover { background: #d4b96a !important; }

        .write-btn {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 50px;
          padding: 10px 28px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .write-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.6);
        }

        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e6e0;
        }

        .pagination-btn {
          border-radius: 50px !important;
          padding: 10px 28px !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          transition: all 0.2s !important;
        }
      `}</style>

      <div className="home-root">
        <Navbar />

        {/* ── Hero ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
          padding: '90px 0 70px', position: 'relative', overflow: 'hidden'
        }}>
          {/* Blobs */}
          <div className="hero-blob1" style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'rgba(224,201,127,0.07)', pointerEvents: 'none'
          }} />
          <div className="hero-blob2" style={{
            position: 'absolute', bottom: '-100px', left: '5%',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
          }} />
          <div className="hero-blob3" style={{
            position: 'absolute', top: '30%', left: '55%',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(224,201,127,0.04)', pointerEvents: 'none'
          }} />

          {/* Grid texture overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px', pointerEvents: 'none'
          }} />

          <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
            <p className="hero-title text-uppercase mb-3" style={{
              color: '#e0c97f', letterSpacing: '5px', fontSize: '0.72rem', fontWeight: 700
            }}>
              ✦ &nbsp; Welcome to Sajin's Blog &nbsp; ✦
            </p>

            <h1 className="hero-title" style={{
              color: 'white',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              fontWeight: 900, lineHeight: 1.1, marginBottom: '18px'
            }}>
              Stories Worth<br />
              <span style={{ color: '#e0c97f' }}>Reading</span>
            </h1>

            <p className="hero-sub" style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
              maxWidth: '440px', margin: '0 auto 36px', lineHeight: 1.7
            }}>
              Discover articles, tutorials, and ideas by Sajin and friends.
            </p>

            {/* Search */}
            <form className="hero-search" onSubmit={handleSearch}
              style={{ maxWidth: '500px', margin: '0 auto 28px' }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search posts..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn search-btn">Search</button>
              </div>
            </form>

            {/* Write CTA */}
            {user && (
              <div className="hero-cta">
                <button className="write-btn" onClick={() => navigate('/create')}>
                  ✍️ &nbsp; Write a Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={{
          background: 'white', borderBottom: '1px solid #efefef',
          padding: '16px 0'
        }}>
          <div className="container d-flex justify-content-center gap-5">
            {[
              { label: 'Posts', value: posts.length + (nextPage ? '+' : '') },
              { label: 'Writers', value: '✦' },
              { label: 'Topics', value: '✦' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a2e' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Posts Section ── */}
        <div className="container py-5">

          {/* Section header */}
          <div className="section-divider">
            <div>
              <h5 style={{ fontWeight: 800, marginBottom: 0, color: '#1a1a2e' }}>
                {search ? `Results for "${search}"` : 'Latest Posts'}
              </h5>
              {search && (
                <button className="btn btn-link p-0 small text-muted"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => { setSearch(''); setSearchInput(''); }}>
                  ← Clear search
                </button>
              )}
            </div>
            {user && (
              <button
                className="btn btn-dark btn-sm rounded-pill px-3 ms-auto"
                style={{ fontSize: '0.82rem' }}
                onClick={() => navigate('/create')}
              >
                + New Post
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#1a1a2e' }} role="status" />
              <p className="text-muted mt-3 small">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
              <h6 style={{ fontWeight: 700, color: '#1a1a2e' }}>No posts found</h6>
              <p className="text-muted small mb-3">
                {search ? 'Try a different search term' : 'Be the first to share something'}
              </p>
              {user && (
                <button className="btn btn-dark btn-sm rounded-pill px-4"
                  onClick={() => navigate('/create')}>
                  ✍️ Write the first post
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((post, i) => (
                <div key={post.id}
                  className="col-lg-4 col-md-6 col-sm-12 post-grid-item"
                  style={{ animationDelay: `${i * 0.07}s` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {(prevPage || nextPage) && (
            <div className="d-flex justify-content-center gap-3 mt-5">
              {prevPage && (
                <button className="btn btn-outline-dark pagination-btn"
                  onClick={() => fetchPosts(prevPage)}>
                  ← Previous
                </button>
              )}
              {nextPage && (
                <button className="btn btn-dark pagination-btn"
                  onClick={() => fetchPosts(nextPage)}>
                  Next →
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
<div style={{
  background: '#1a1a2e', color: 'rgba(255,255,255,0.4)',
  textAlign: 'center', padding: '28px',
  fontSize: '0.82rem', marginTop: '40px'
}}>
  <span style={{ color: '#e0c97f' }}>✦ Sajin's Blog</span>
  &nbsp;·&nbsp; Built by&nbsp;
  <a href="https://github.com/Sajin1119" target="_blank" rel="noreferrer"
    style={{ color: '#e0c97f', textDecoration: 'none' }}>Sajin</a>
  &nbsp;·&nbsp;
  <a href="https://www.linkedin.com/in/sajinsatheesan/" target="_blank" rel="noreferrer"
    style={{ color: '#e0c97f', textDecoration: 'none' }}>LinkedIn</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/Sajin1119" target="_blank" rel="noreferrer"
    style={{ color: '#e0c97f', textDecoration: 'none' }}>GitHub</a>
</div>
      </div>
    </>
  );
};

export default Home;
