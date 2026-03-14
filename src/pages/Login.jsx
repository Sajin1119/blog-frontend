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
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    API.post("api/users/login/", formData)
      .then(res => {
        login(res.data.access, res.data.refresh, { username: formData.username });
        navigate("/");
      })
      .catch(() => setError("Invalid username or password"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(224,201,127,0.06)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Logo / Brand */}
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{
              color: '#e0c97f', letterSpacing: '4px',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8
            }}>✦ Blog Platform</p>
          </Link>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Sign in to continue writing
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
        }}>

          {error && (
            <div className="alert alert-danger py-2 small mb-4" style={{ borderRadius: '10px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-uppercase text-muted">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control border-0 bg-light"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ borderRadius: '10px', padding: '12px 16px' }}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-uppercase text-muted">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control border-0 bg-light"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '10px', padding: '12px 16px', paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#999', fontSize: '1rem'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                : '→ Sign In'
              }
            </button>

          </form>

          {/* Divider */}
          <div className="d-flex align-items-center my-4">
            <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
            <span className="px-3 small text-muted">or</span>
            <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
          </div>

          {/* Register link */}
          <p className="text-center small mb-0" style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a1a2e', fontWeight: 700, textDecoration: 'none' }}>
              Create one →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
