import { useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
const handleSubmit = e => {
  e.preventDefault();
  console.log('Sending:', formData); // 👈 ADD THIS LINE
  setLoading(true); 
  setError('');
  API.post('api/users/login/', formData)
    .then(res => {
      login(res.data.access, res.data.refresh, res.data.user);
      navigate('/');
    })
    .catch(err => {
      const status = err.response?.status;
      if (status === 403) setError('Email not verified. Please register again.');
      else setError('Invalid username or password');
    })
    .finally(() => setLoading(false));
};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .li-input { border-radius: 10px !important; padding: 12px 16px !important; border: 2px solid transparent !important; background: #f4f4f6 !important; transition: all 0.25s !important; font-size: 0.95rem !important; }
        .li-input:focus { background: white !important; border-color: #1a1a2e !important; box-shadow: 0 0 0 4px rgba(26,26,46,0.08) !important; outline: none !important; }
        .li-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #1a1a2e, #0f3460); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
        .li-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(26,26,46,0.3); }
        .li-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blobFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        .card-anim { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .blob1 { animation: blobFloat 7s ease-in-out infinite; }
        .blob2 { animation: blobFloat 9s ease-in-out infinite reverse; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div className="blob1" style={{ position: 'absolute', top: '-100px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(224,201,127,0.07)', pointerEvents: 'none' }} />
        <div className="blob2" style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-4">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p style={{ color: '#e0c97f', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>✦ Blog Platform</p>
            </Link>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Sign in to continue writing</p>
          </div>

          <div className="card-anim" style={{ background: 'rgba(255,255,255,0.97)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '10px 14px', color: '#c0392b', fontSize: '0.875rem', marginBottom: '20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>Username</label>
                <input type="text" name="username" className="form-control li-input" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" className="form-control li-input" placeholder="Enter your password" value={formData.password} onChange={handleChange} required style={{ paddingRight: '48px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="li-btn" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : '→ Sign In'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
              <span style={{ padding: '0 12px', fontSize: '0.8rem', color: '#bbb' }}>or</span>
              <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#666', marginBottom: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1a1a2e', fontWeight: 700, textDecoration: 'none' }}>Create one →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
