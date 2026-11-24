import React, { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/languageContextValue';
import { useMediaQuery } from '../utils/useMediaQuery';

// Pages that should not show the shared back button
const NO_BACK_PATHS = ['/dashboard', '/dashboard/progress']; // progress has its own

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const showBack = !NO_BACK_PATHS.includes(pathname.replace(/\/+$/, ''));

  // On phones the sidebar is a drawer, opened from the header's menu button.
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div style={styles.layout}>
      <Sidebar isMobile={isMobile} mobileOpen={menuOpen} onMobileClose={closeMenu} />
      <div style={styles.mainWrapper}>
        <TopNav isMobile={isMobile} onMenuClick={() => setMenuOpen(true)} />
        <main style={{ ...styles.content, padding: isMobile ? '16px' : '32px' }}>
          <div style={styles.container}>
            {showBack && (
              <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                <ArrowLeft size={20} /> {lang === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
              </button>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color)',
  },
  mainWrapper: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // prevent double scrollbar
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  container: {
    maxWidth: 'none',
    margin: '0 auto',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '24px',
  }
};

export default DashboardLayout;
