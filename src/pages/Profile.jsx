import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      API.get('api/users/profile/')
        .then(res => {
          setProfile(res.data);
          setBio(res.data.bio || '');
          setEmail(res.data.email || '');
        })
        .catch(err => console.log("Profile error:", err));

      // Fetch all posts and filter by logged-in user
      API.get('api/posts/')
        .then(res => {
          const all = Array.isArray(res.data) ? res.data : res.data.results ?? [];
          const mine = all.filter(p => p.author?.username === user.username);
          setPosts(mine);
        })
        .catch(err => console.log("Posts error:", err));
    }
  }, [user]);

  const handleSave = () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('email', email);
    if (profilePic) formData.append('profile_pic', profilePic);

    API.patch('api/users/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(res => {
        setProfile(res.data);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to update profile.');
      })
      .finally(() => setSaving(false));
  };

  const handleDeletePost = (post) => {
    if (!window.confirm('Delete this post?')) return;
    API.delete(`api/posts/delete/${post.id}/`)
      .then(() => setPosts(prev => prev.filter(p => p.id !== post.id)))
      .catch(err => console.error('Delete failed:', err));
  };

  const getAvatarUrl = () => {
    if (!profile?.profile_pic) return null;
    return profile.profile_pic.startsWith('http')
      ? profile.profile_pic
      : `http://127.0.0.1:8000${profile.profile_pic}`;
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
  };

  if (!profile) return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-dark" role="status" />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: '750px' }}>

        {/* Profile Card */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">

          {/* Top Banner */}
          <div style={{ height: '100px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />

          <div className="card-body px-4 pb-4">

            {/* Avatar + Edit buttons */}
            <div className="d-flex justify-content-between align-items-end mt-n5 mb-3">
              <div style={{ position: 'relative' }}>
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt="avatar"
                    style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      objectFit: 'cover', border: '4px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    background: '#1a1a2e', border: '4px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
                {editing && (
                  <label style={{
                    position: 'absolute', bottom: 0, right: 0,
                    background: '#1a1a2e', borderRadius: '50%',
                    width: '28px', height: '28px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '2px solid white'
                  }}>
                    <span style={{ color: 'white', fontSize: '14px' }}>📷</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setProfilePic(e.target.files[0])} />
                  </label>
                )}
              </div>

              <div className="d-flex gap-2">
                {editing ? (
                  <>
                    <button className="btn btn-sm btn-outline-secondary"
                      onClick={() => { setEditing(false); setError(null); }}>Cancel</button>
                    <button className="btn btn-sm btn-dark" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-outline-dark" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <h4 className="fw-bold mb-0">{profile.username}</h4>
            <p className="text-muted small mb-3">
              Member since {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">Profile updated!</div>}

            <hr />

            <div className="mb-3">
              <label className="form-label fw-semibold small text-uppercase text-muted">Email</label>
              {editing ? (
                <input type="email" className="form-control" value={email}
                  onChange={e => setEmail(e.target.value)} />
              ) : (
                <p className="mb-0">{profile.email || '—'}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-uppercase text-muted">Bio</label>
              {editing ? (
                <textarea className="form-control" rows="3" placeholder="Tell us about yourself..."
                  value={bio} onChange={e => setBio(e.target.value)} />
              ) : (
                <p className="mb-0 text-secondary">{profile.bio || 'No bio yet.'}</p>
              )}
            </div>

            {editing && profilePic && (
              <div className="mt-2">
                <p className="small text-muted mb-1">New photo preview:</p>
                <img src={URL.createObjectURL(profilePic)} alt="preview"
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {/* My Posts */}
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">My Posts <span className="text-muted fw-normal">({posts.length})</span></h5>
          <button className="btn btn-dark btn-sm" onClick={() => navigate('/create')}>+ New Post</button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>You haven't written any posts yet.</p>
            <button className="btn btn-dark btn-sm" onClick={() => navigate('/create')}>Write your first post</button>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
              <div className="row g-0">
                {post.image && (
                  <div className="col-3">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100px' }}
                    />
                  </div>
                )}
                <div className={post.image ? 'col-9' : 'col-12'}>
                  <div className="card-body py-3 px-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold mb-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/post/${post.slug}`)}
                        >
                          {post.title}
                        </h6>
                        <p className="text-muted small mb-2">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                          {post.category && <span className="ms-2 badge bg-secondary">{post.category}</span>}
                          {!post.is_published && <span className="ms-2 badge bg-warning text-dark">Draft</span>}
                        </p>
                        <p className="small text-secondary mb-0" style={{
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                          {post.content}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/edit/${post.id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeletePost(post)}
                      >
                        🗑 Delete
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-auto"
                        onClick={() => navigate(`/post/${post.slug}`)}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Profile;
