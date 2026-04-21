import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowRightLeft, 
  HandCoins, 
  LifeBuoy, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User,
  Megaphone
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Accounts', icon: CreditCard, path: '/accounts' },
    { name: 'Transfers', icon: ArrowRightLeft, path: '/transfers' },
    { name: 'Loans', icon: HandCoins, path: '/loans' },
    { name: 'Support', icon: LifeBuoy, path: '/support' }
  ];

  if (user?.roles?.some(role => ['ROLE_ADMIN', 'ROLE_ADVERTISEMENT_ADMIN'].includes(role))) {
    navItems.push({ name: 'Ad Management', icon: Megaphone, path: '/admin/advertisements' });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        backgroundColor: 'var(--primary-color)', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', height: '32px', backgroundColor: 'var(--accent-color)', borderRadius: '8px'
          }}></div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>APEX FINANCIAL</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.25rem',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '400'
              })}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.875rem 1rem', 
              color: 'rgba(255,255,255,0.6)',
              width: '100%',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar */}
        <header style={{ 
          height: 'var(--header-height)', 
          backgroundColor: 'var(--surface-color)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ 
              backgroundColor: 'var(--bg-color)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              width: '100%',
              maxWidth: '400px',
              border: '1px solid var(--border-color)'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                placeholder="Search transactions..." 
                style={{ 
                  background: 'none', border: 'none', paddingLeft: '0.5rem', width: '100%', fontSize: '0.875rem'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{ color: 'var(--text-muted)', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--error-color)', borderRadius: '50%'
              }}></span>
            </button>
            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.username}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <div style={{ 
                width: '40px', height: '40px', backgroundColor: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', border: '1px solid var(--border-color)'
              }}>
                <User size={20} style={{ margin: 'auto' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
