import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  onLogout: () => void;
}

function Layout({ onLogout }: LayoutProps) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">🦷 Dental CMS</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/patients" className={`nav-link ${isActive('/patients')}`}>
            <span className="nav-icon">👥</span>
            <span>Patients</span>
          </Link>
          <Link to="/appointments" className={`nav-link ${isActive('/appointments')}`}>
            <span className="nav-icon">📅</span>
            <span>Appointments</span>
          </Link>
          <Link to="/treatments" className={`nav-link ${isActive('/treatments')}`}>
            <span className="nav-icon">🦷</span>
            <span>Treatments</span>
          </Link>
          <Link to="/invoices" className={`nav-link ${isActive('/invoices')}`}>
            <span className="nav-icon">💰</span>
            <span>Invoices</span>
          </Link>
          <Link to="/staff" className={`nav-link ${isActive('/staff')}`}>
            <span className="nav-icon">👨‍⚕️</span>
            <span>Staff</span>
          </Link>
        </nav>
      </aside>
      
      <div className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>{location.pathname.split('/')[1] || 'Dashboard'}</h1>
          </div>
          <div className="header-actions">
            <div className="user-menu">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span className="user-role">{user.role}</span>
              <button onClick={onLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

