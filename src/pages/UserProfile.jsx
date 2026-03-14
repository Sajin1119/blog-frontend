import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all posts and filter by username
    API.get('api/posts/')
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : res.data.results ?? [];
        const userPosts = all.filter(p => p.author?.username === username);
        setPosts(userPosts);

        // Extract profile info from the first post's author field
        if (userPosts.length > 0) {
          setProfile(userPosts[0].author);
        } else {
          // No posts but still show the username
          setProfile({ username });
        }
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [username]);

  const getAvatarUrl = (pic) => {
    if (!pic) return null;
    return pic.startsWith('http') ? pic : `http://127.0.0.1:8000${pic}`;
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" style={{ color: '#1a1a2e' }} role="status" />
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <p className="text-center mt-5 text-danger">{error}</p>
    </>
  );

  const avatarUrl = getAvatarUrl(profile?.profile_pic);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .up-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f8f7f4; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .post-item { animation: cardIn 0.45s ease both; }
        .post-item:nth-child(1) { animation-delay: 0.05s; }
        .post-item:nth-child(2) { animation-delay: 0.12s; }
        .post-item:nth-child(3) { animation-delay: 0.19s; }
        .post-item:nth-child(4) { animation-delay: 0.26s; }
        .post-item:nth-child(5) { animation-delay: 0.33s; }
        .post-item:nth-child(6) { animation-delay: 0.40s; }
      `}</style>

      <div className="up-root">
        <Navbar />

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
          padding: '60px 0 80px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'rgba(224,201,127,0.06)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px', pointerEvents: 'none'
          }} />
        </div>

        {/* Profile Card — overlaps banner */}
        <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 1 }}>
          <div className="fade-up" style={{
            background: 'white', borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            padding: '32px', maxWidth: '700px', margin: '0 auto 40px'
          }}>
            <div className="d-flex align-items-center gap-4 flex-wrap">

              {/* Avatar */}
              {avatarUrl ? (
                <img src={avatarUrl} alt={username}
                  style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    objectFit: 'cover', border: '4px solid #f8f7f4',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0
                  }} />
              ) : (
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                  border: '4px solid #f8f7f4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', color: 'white', fontWeight: 800, flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                }}>
                  {username[0].toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{
                  color: '#e0c97f', fontSize: '0.7rem', fontWeight: 700,
                  letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px'
                }}>✦ Author</p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800, fontSize: '1.8rem',
                  color: '#1a1a2e', marginBottom: '6px'
                }}>
                  {username}
                </h2>
                {profile?.bio && (
                  <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.6 }}>
                    {profile.bio}
                  </p>
                )}
                <div className="d-flex gap-3 align-items-center">
                  <span style={{
                    background: '#f0efe9', borderRadius: '50px',
                    padding: '4px 14px', fontSize: '0.78rem',
                    fontWeight: 600, color: '#555'
                  }}>
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="fade-up-1" style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'
            }}>
              <h5 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 0 }}>
                Posts by {username}
              </h5>
              <div style={{ flex: 1, height: '1px', background: '#e8e6e0' }} />
            </div>

            {posts.length === 0 ? (
              <div className="fade-up-2 text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                <p style={{ color: '#999', fontWeight: 500 }}>No posts yet</p>
              </div>
            ) : (
              <div className="row g-4">
                {posts.map((post, i) => (
                  <div key={post.id}
                    className="col-md-6 col-sm-12 post-item"
                    style={{ animationDelay: `${i * 0.07}s` }}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#1a1a2e', color: 'rgba(255,255,255,0.4)',
          textAlign: 'center', padding: '28px',
          fontSize: '0.82rem', marginTop: '60px'
        }}>
          <span style={{ color: '#e0c97f' }}>✦ Blog Platform</span>
          &nbsp;·&nbsp; Built with Django & React
        </div>
      </div>
    </>
  );
};

export default UserProfile;
