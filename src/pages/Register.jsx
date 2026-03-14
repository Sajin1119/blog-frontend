import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: '#e74c3c', width: '25%' };
    if (p.length < 10) return { label: 'Fair', color: '#f39c12', width: '55%' };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { label: 'Strong', color: '#27ae60', width: '100%' };
    return { label: 'Good', color: '#2980b9', width: '75%' };
  };
  const strength = passwordStrength();

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.password !== formData.password2) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");

    API.post("api/users/register/", formData)
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1800);
      })
      .catch(err => {
        const data = err.response?.data;
        if (data?.email) setError(data.email[0]);
        else if (data?.username) setError(data.username[0]);
        else setError("Registration failed. Try another username or email.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .reg-input { border-radius: 10px !important; padding: 12px 16px !important; border: 2px solid transparent !important; background: #f4f4f6 !important; transition: all 0.25s !important; font-size: 0.95rem !important; }
        .reg-input:focus { background: white !important; border-color: #1a1a2e !important; box-shadow: 0 0 0 4px rgba(26,26,46,0.08) !important; outline: none !important; }
        .reg-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #1a1a2e, #0f3460); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
        .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(26,26,46,0.3); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blobFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes successPop { 0% { transform: scale(0.7); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes checkDraw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
        .card-animate { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .blob1 { animation: blobFloat 7s ease-in-out infinite; }
        .blob2 { animation: blobFloat 9s ease-in-out infinite reverse; }
        .success-pop { animation: successPop 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .check-draw { stroke-dasharray: 60; stroke-dashoffset: 60; animation: checkDraw 0.5s 0.3s ease forwards; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div className="blob1" style={{ position: 'absolute', top: '-100px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(224,201,127,0.07)', pointerEvents: 'none' }} />
        <div className="blob2" style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '430px', position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-4">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p style={{ color: '#e0c97f', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>✦ Blog Platform</p>
            </Link>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>Create account</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Join and start sharing your stories</p>
          </div>

          {success ? (
            <div className="success-pop" style={{ background: 'rgba(255,255,255,0.97)', borderRadius: '20px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <polyline className="check-draw" points="7,18 15,26 29,10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h5 style={{ fontWeight: 800, marginBottom: 8 }}>You're in!</h5>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>Redirecting to login...</p>
            </div>
          ) : (
            <div className="card-animate" style={{ background: 'rgba(255,255,255,0.97)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '10px 14px', color: '#c0392b', fontSize: '0.875rem', marginBottom: '20px' }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {[
                  { name: 'username', label: 'Username', type: 'text', placeholder: 'Pick a username' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.name} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} name={f.name} className="form-control reg-input" placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange} required />
                  </div>
                ))}

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} name="password" className="form-control reg-input" placeholder="Create a password" value={formData.password} onChange={handleChange} required style={{ paddingRight: '48px' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {strength && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ height: '4px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '4px', transition: 'all 0.4s' }} />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: strength.color, marginTop: '4px', marginBottom: 0 }}>{strength.label} password</p>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '6px' }}>Confirm Password</label>
                  <input type="password" name="password2" className="form-control reg-input" placeholder="Repeat your password" value={formData.password2} onChange={handleChange} required />
                  {formData.password2 && (
                    <p style={{ fontSize: '0.75rem', marginTop: '4px', marginBottom: 0, color: formData.password === formData.password2 ? '#27ae60' : '#e74c3c' }}>
                      {formData.password === formData.password2 ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button type="submit" className="reg-btn" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : '→ Create Account'}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
                <span style={{ padding: '0 12px', fontSize: '0.8rem', color: '#bbb' }}>or</span>
                <hr style={{ flex: 1, borderColor: '#e9ecef' }} />
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#666', marginBottom: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1a1a2e', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
