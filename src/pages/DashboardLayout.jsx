import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserRound, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/languageContextValue';
import { useMediaQuery } from '../utils/useMediaQuery';
import { startSync } from '../lib/sync';
import { accountsEnabled, useAuth } from '../lib/auth';

// Pages that should not show the shared back button
const NO_BACK_PATHS = ['/dashboard', '/dashboard/progress']; // progress has its own

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const showBack = !NO_BACK_PATHS.includes(pathname.replace(/\/+$/, ''));

  // Back up progress in the background (does nothing if cloud backup isn't set up).
  useEffect(() => { startSync(); }, []);

  // A guest has no account: remind her, once per visit, that her progress only lives on this device.
  const auth = useAuth();
  const isGuest = accountsEnabled && auth.status === 'signedOut';
  const [bannerHidden, setBannerHidden] = useState(() => {
    try { return sessionStorage.getItem('guestBannerHidden') === '1'; } catch { return false; }
  });
  const hideBanner = () => {
    setBannerHidden(true);
    try { sessionStorage.setItem('guestBannerHidden', '1'); } catch { /* storage unavailable */ }
  };

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
            {isGuest && !bannerHidden && (
              <div style={styles.guestBanner} role="status">
                <UserRound size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: '200px' }}>
                  {lang === 'hi'
                    ? 'आप गेस्ट हैं। आपकी प्रगति सिर्फ़ इसी डिवाइस पर रहती है। साइन इन करें ताकि उसका बैकअप रहे।'
                    : "You're using guest mode. Your progress stays on this device only. Sign in to back it up."}
                </span>
                <button type="button" className="btn btn-primary" style={styles.bannerBtn} onClick={() => navigate('/?mode=signin')}>
                  {lang === 'hi' ? 'साइन इन' : 'Sign in'}
                </button>
                <button type="button" className="btn btn-secondary" style={styles.bannerBtn} onClick={() => navigate('/?mode=signup')}>
                  {lang === 'hi' ? 'अकाउंट बनाएं' : 'Create account'}
                </button>
                <button type="button" style={styles.bannerClose} onClick={hideBanner} aria-label={lang === 'hi' ? 'बंद करें' : 'Dismiss'}>
                  <X size={18} />
                </button>
              </div>
            )}
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
  guestBanner: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px 14px',
    padding: '12px 16px',
    marginBottom: '20px',
    backgroundColor: 'var(--primary-light)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.95rem',
  },
  bannerBtn: { padding: '6px 14px', fontSize: '0.9rem' },
  bannerClose: { color: 'var(--text-muted)', display: 'flex', padding: '4px' },
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
