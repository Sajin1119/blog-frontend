import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        .navbar-custom {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
          padding: 0;
        }
        .navbar-custom.scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
        }
        .nav-brand {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: white !important;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.3px;
        }
        .nav-brand span { color: #e0c97f; }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-link-item {
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(255,255,255,0.7) !important;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link-item:hover, .nav-link-item.active {
          color: white !important;
          background: rgba(255,255,255,0.1);
        }
        .nav-write-btn {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a2e !important;
          background: #e0c97f;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 50px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .nav-write-btn:hover {
          background: #d4b96a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(224,201,127,0.4);
        }
        .nav-login-btn {
          font-size: 0.85rem;
          font-weight: 600;
          color: white !important;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.3);
          transition: all 0.2s;
        }
        .nav-login-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.6);
        }

        /* User dropdown */
        .user-dropdown { position: relative; }
        .user-trigger {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          padding: 6px 14px 6px 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .user-trigger:hover { background: rgba(255,255,255,0.18); }
        .user-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: #e0c97f; color: #1a1a2e;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 800;
        }
        .dropdown-menu-custom {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: white; border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
          min-width: 180px; padding: 8px;
          animation: dropdownIn 0.2s ease both;
          z-index: 999;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item-custom {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 500;
          color: #333; text-decoration: none;
          transition: background 0.15s;
          cursor: pointer; border: none; background: none; width: 100%;
          text-align: left;
        }
        .dropdown-item-custom:hover { background: #f5f5f5; color: #1a1a2e; }
        .dropdown-item-custom.danger { color: #e74c3c; }
        .dropdown-item-custom.danger:hover { background: #fff5f5; }
        .dropdown-divider-custom {
          height: 1px; background: #f0f0f0; margin: 6px 0;
        }

        /* Mobile */
        .mobile-toggle {
          display: none;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 7px 10px;
          cursor: pointer;
          color: white; font-size: 1rem;
        }
        .mobile-menu {
          background: #16213e;
          padding: 12px 0 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: dropdownIn 0.25s ease both;
        }
        .mobile-link {
          display: block; padding: 11px 20px;
          color: rgba(255,255,255,0.75); text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          transition: all 0.15s;
          border: none; background: none; width: 100%; text-align: left;
          cursor: pointer;
        }
        .mobile-link:hover { color: white; background: rgba(255,255,255,0.07); }
        .mobile-link.danger { color: #e87777; }

        @media (max-width: 768px) {
          .mobile-toggle { display: flex; align-items: center; }
          .desktop-nav { display: none !important; }
        }
      `}</style>

      <nav className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
        <div className="container">
          <div className="navbar-inner">

            {/* Brand */}
            <Link className="nav-brand" to="/">
              <span>✦</span> Blog<span>Platform</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="nav-links desktop-nav">
              <li>
                <Link className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`} to="/">
                  Home
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link className={`nav-link-item ${location.pathname === '/create' ? 'active' : ''}`} to="/create">
                      ✍️ Write
                    </Link>
                  </li>
                  <li style={{ marginLeft: '8px' }}>
                    <div className="user-dropdown">
                      <button className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                        {user.username}
                        <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: '2px' }}>
                          {dropdownOpen ? '▲' : '▼'}
                        </span>
                      </button>
                      {dropdownOpen && (
                        <>
                          {/* Backdrop */}
                          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                            onClick={() => setDropdownOpen(false)} />
                          <div className="dropdown-menu-custom">
                            <Link className="dropdown-item-custom" to="/profile">
                              <span>👤</span> Profile
                            </Link>
                            <Link className="dropdown-item-custom" to="/create">
                              <span>✍️</span> New Post
                            </Link>
                            <div className="dropdown-divider-custom" />
                            <button className="dropdown-item-custom danger" onClick={handleLogout}>
                              <span>🚪</span> Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="nav-link-item" to="/login">Login</Link>
                  </li>
                  <li style={{ marginLeft: '8px' }}>
                    <Link className="nav-write-btn" to="/register">Get Started</Link>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile toggle */}
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            <div className="container">
              <Link className="mobile-link" to="/">🏠 Home</Link>
              {user ? (
                <>
                  <Link className="mobile-link" to="/create">✍️ Write a Post</Link>
                  <Link className="mobile-link" to="/profile">👤 {user.username}</Link>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 20px' }} />
                  <button className="mobile-link danger" onClick={handleLogout}>🚪 Logout</button>
                </>
              ) : (
                <>
                  <Link className="mobile-link" to="/login">Login</Link>
                  <Link className="mobile-link" to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
