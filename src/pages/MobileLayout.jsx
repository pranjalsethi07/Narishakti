import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, Sparkles, Landmark, Grid2x2, X, Monitor, Globe, Lock } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { accountsEnabled, useAuth } from '../lib/auth';
import { lockedInfoFor } from '../lib/guestAccess';
import { recordDailyActivity } from '../utils/userProgress';
import { startSync } from '../lib/sync';
import { setMobileMode, isNativeApp } from '../utils/appMode';
import { useMediaQuery } from '../utils/useMediaQuery';
import { NAV, getCrumbs } from '../components/navConfig';
import CoinFlight from '../components/CoinFlight';
import NotificationBell from '../components/header/NotificationBell';
import AvatarMenu from '../components/header/AvatarMenu';
import Logo from '../components/Logo';
import SosButton from '../components/sos/SosButton';

// The phone version of the dashboard, reached at /m. Same pages as /dashboard, wrapped in an app-style shell:
// a slim top bar, a bottom tab bar for the main places, and a "More" sheet for everything else.
const TABS = [
  { key: 'home', path: '/m', icon: Home, end: true, en: 'Home', hi: 'होम' },
  { key: 'learn', path: '/m/learn', icon: BookOpen, en: 'Learn', hi: 'सीखें' },
  { key: 'ask', path: '/m/ask', icon: Sparkles, en: 'Ask AI', hi: 'AI से पूछें' },
  { key: 'schemes', path: '/m/schemes', icon: Landmark, en: 'Schemes', hi: 'योजनाएं' },
];

// '/dashboard/x' in the shared menu data becomes '/m/x' here.
const toM = (path) => path.replace(/^\/dashboard/, '/m');

const MobileLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const hi = lang === 'hi';
  const auth = useAuth();
  const isGuest = accountsEnabled && auth.status === 'signedOut';
  // The sheet remembers which page it was opened on, so it closes by itself when you move to another page.
  const [openedAt, setOpenedAt] = useState(null);
  const moreOpen = openedAt === pathname;
  const setMoreOpen = (on) => setOpenedAt(on ? pathname : null);

  useEffect(() => { startSync(); recordDailyActivity(); }, []);

  const path = pathname.replace(/\/+$/, '') || '/m';
  const isHome = path === '/m';
  const isTab = TABS.some((tab) => tab.path === path);
  // On a computer screen the app is drawn inside a phone outline; on a real phone it fills the screen.
  const wideScreen = useMediaQuery('(min-width: 600px)');
  const framed = wideScreen && !isNativeApp();
  const goBack = () => {
    if (isTab || !(window.history.state?.idx > 0)) navigate('/m');
    else navigate(-1);
  };
  const crumbs = getCrumbs(path.replace(/^\/m/, '/dashboard'), t, lang);
  const title = path === '/m' ? 'narishakti' : crumbs[crumbs.length - 1];

  const goDesktop = () => {
    setMobileMode(false);
    navigate(path.replace(/^\/m/, '/dashboard') || '/dashboard');
  };

  const sections = NAV.flatMap((node) => {
    if (node.type === 'group') return [{ heading: t(node.labelKey), items: node.items }];
    return [{ heading: null, items: [node] }];
  });
  // Merge the single links into one list so the sheet isn't a pile of one-row sections.
  const grouped = [];
  const singles = [];
  sections.forEach((s) => (s.heading ? grouped.push(s) : singles.push(...s.items)));

  const content = (
    <div style={framed ? styles.shellFramed : styles.shell}>
      <header style={framed ? styles.topFramed : styles.top}>
        {isHome ? (
          <span style={styles.brandRow}><Logo width={36} showText={false} /><span style={styles.brand}>narishakti</span></span>
        ) : (
          <>
            <button type="button" style={styles.iconBtn} onClick={goBack} aria-label={hi ? 'वापस' : 'Back'}>
              <ArrowLeft size={22} />
            </button>
            <h1 style={styles.title}>{title}</h1>
          </>
        )}
        <div style={styles.topActions}>
          <SosButton variant="header" />
          <NotificationBell lang={lang} streak={0} canUseProfile={!isGuest} />
          <AvatarMenu lang={lang} setLang={setLang} t={t} />
        </div>
      </header>

      <CoinFlight />
      <main style={framed ? styles.mainFramed : styles.main}>
        <Outlet />
      </main>

      <nav style={framed ? styles.tabBarFramed : styles.tabBar} aria-label={hi ? 'मुख्य मेनू' : 'Main menu'}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink key={tab.key} to={tab.path} end={tab.end} style={({ isActive }) => ({ ...styles.tab, color: isActive ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive ? 700 : 500 })}>
              <Icon size={22} />
              <span>{hi ? tab.hi : tab.en}</span>
            </NavLink>
          );
        })}
        <button type="button" style={{ ...styles.tab, color: moreOpen ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setMoreOpen(true)} aria-haspopup="dialog">
          <Grid2x2 size={22} />
          <span>{hi ? 'और' : 'More'}</span>
        </button>
      </nav>

      {moreOpen && (
        <div style={framed ? styles.overlayFramed : styles.overlay} onClick={() => setMoreOpen(false)}>
          <div style={styles.sheet} role="dialog" aria-modal="true" aria-label={hi ? 'सभी सेक्शन' : 'All sections'} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHead}>
              <strong>{hi ? 'सभी सेक्शन' : 'All sections'}</strong>
              <button type="button" style={styles.iconBtn} onClick={() => setMoreOpen(false)} aria-label={hi ? 'बंद करें' : 'Close'}><X size={20} /></button>
            </div>

            {grouped.map((g) => (
              <section key={g.heading}>
                <h2 style={styles.groupHead}>{g.heading}</h2>
                <div style={styles.grid}>
                  {g.items.map((item) => <SheetItem key={item.key} item={item} t={t} locked={isGuest && lockedInfoFor(item.path)} />)}
                </div>
              </section>
            ))}
            <h2 style={styles.groupHead}>{hi ? 'और' : 'Other'}</h2>
            <div style={styles.grid}>
              {singles.filter((s) => s.path !== '/dashboard').map((item) => <SheetItem key={item.key} item={item} t={t} locked={isGuest && lockedInfoFor(item.path)} />)}
            </div>

            <div style={styles.footerRow}>
              <button type="button" style={styles.footBtn} onClick={() => setLang(hi ? 'en' : 'hi')}>
                <Globe size={16} /> {hi ? 'Switch to English' : 'हिंदी में बदलें'}
              </button>
              {!isNativeApp() && (
                <button type="button" style={styles.footBtn} onClick={goDesktop}>
                  <Monitor size={16} /> {hi ? 'डेस्कटॉप व्यू' : 'Desktop view'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!framed) return content;
  return (
    <div style={styles.stage}>
      <div style={styles.device} data-phone-screen>
        <div style={styles.notch} aria-hidden="true" />
        {content}
      </div>
    </div>
  );
};

const SheetItem = ({ item, t, locked }) => {
  const Icon = item.icon;
  return (
    <NavLink to={toM(item.path)} end={item.path === '/dashboard'} style={styles.cell}>
      <span style={styles.cellIcon}><Icon size={22} color="var(--primary)" /></span>
      <span style={styles.cellLabel}>{t(item.key)}</span>
      {locked && <Lock size={12} color="var(--text-light)" style={{ position: 'absolute', top: 8, right: 8 }} />}
    </NavLink>
  );
};

const MAX_W = 430; // on a wide screen the app is a centred phone-sized column
const DEVICE_W = 390;
const BAR = 62; // tab bar height, not counting the phone's bottom safe area

const styles = {
  // phone outline shown on computer screens
  stage: { minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'radial-gradient(circle at 30% 20%, #3a2a55, #14101f 70%)' },
  device: {
    position: 'relative', width: DEVICE_W + 24, height: 'min(844px, calc(100dvh - 32px))', borderRadius: 52, border: '12px solid #0e0e12',
    boxShadow: '0 0 0 2px #4a4a55, 0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden', backgroundColor: 'var(--bg-color)', transform: 'translateZ(0)', // makes fixed pop-ups (like SOS) stay inside the outline
  },
  notch: { position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 96, height: 24, borderRadius: 14, backgroundColor: '#0e0e12', zIndex: 60 },
  shellFramed: { position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' },
  topFramed: { flex: 'none', zIndex: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '36px 12px 8px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)' },
  mainFramed: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 14 },
  tabBarFramed: { flex: 'none', display: 'flex', height: BAR, backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)' },
  overlayFramed: { position: 'absolute', inset: 0, zIndex: 40, backgroundColor: 'rgba(30,20,50,0.45)', display: 'flex', alignItems: 'flex-end' },
  shell: { minHeight: '100dvh', width: '100%', maxWidth: MAX_W, margin: '0 auto', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', boxShadow: '0 0 0 1px var(--border-color), 0 0 40px rgba(0,0,0,0.08)', position: 'relative' },
  top: {
    position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px',
    padding: 'calc(env(safe-area-inset-top) + 8px) 12px 8px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 },
  brand: { fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-dark)', letterSpacing: '-0.3px' },
  title: { fontFamily: 'inherit', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 },
  topActions: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' },
  iconBtn: { width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', flexShrink: 0 },
  main: { flex: 1, minWidth: 0, padding: `14px 14px calc(${BAR}px + env(safe-area-inset-bottom) + 18px)`, overflowX: 'hidden' },
  tabBar: {
    position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: MAX_W, bottom: 0, zIndex: 30, display: 'flex',
    height: `calc(${BAR}px + env(safe-area-inset-bottom))`, paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)', boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
  },
  tab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: '0.72rem', fontFamily: 'inherit', background: 'none', border: 'none', minWidth: 0 },
  overlay: { position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(30,20,50,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  sheet: {
    width: '100%', maxWidth: MAX_W, maxHeight: '85dvh', overflowY: 'auto', backgroundColor: 'var(--surface)', borderRadius: '20px 20px 0 0',
    padding: '14px 16px calc(env(safe-area-inset-bottom) + 18px)',
  },
  sheetHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  groupHead: { fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '14px 0 8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 },
  cell: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 6px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', textAlign: 'center' },
  cellIcon: { display: 'flex' },
  cellLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.2 },
  footerRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 },
  footBtn: { flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-dark)', fontFamily: 'inherit' },
};

export default MobileLayout;
