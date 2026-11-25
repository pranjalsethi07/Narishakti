import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, Sparkles, Landmark, Grid2x2, X, Monitor, Globe, Lock } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { accountsEnabled, useAuth } from '../lib/auth';
import { lockedInfoFor } from '../lib/guestAccess';
import { recordDailyActivity } from '../utils/userProgress';
import { startSync } from '../lib/sync';
import { setMobileMode, isNativeApp } from '../utils/appMode';
import { NAV, getCrumbs } from '../components/navConfig';
import CoinFlight from '../components/CoinFlight';
import NotificationBell from '../components/header/NotificationBell';
import AvatarMenu from '../components/header/AvatarMenu';
import Logo from '../components/Logo';
import SosButton from '../components/sos/SosButton';

// The phone version of the dashboard, reached at /m. Same pages as /dashboard, wrapped in an app-style shell:
// a slim top bar, a bottom tab bar for the main places, and a "More" sheet for everything else.
const BASE = '/m/dashboard';
const TABS = [
  { key: 'home', path: BASE, icon: Home, end: true, en: 'Home', hi: 'होम' },
  { key: 'learn', path: BASE + '/learn', icon: BookOpen, en: 'Learn', hi: 'सीखें' },
  { key: 'ask', path: BASE + '/ask', icon: Sparkles, en: 'Ask AI', hi: 'AI से पूछें' },
  { key: 'schemes', path: BASE + '/schemes', icon: Landmark, en: 'Schemes', hi: 'योजनाएं' },
];

// '/dashboard/x' in the shared menu data becomes '/m/x' here.
const toM = (path) => path.replace(/^\/dashboard/, BASE);

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

  const path = pathname.replace(/\/+$/, '') || BASE;
  const isHome = path === BASE;
  const isTab = TABS.some((tab) => tab.path === path);
  const goBack = () => {
    if (isTab || !(window.history.state?.idx > 0)) navigate(BASE);
    else navigate(-1);
  };
  const crumbs = getCrumbs(path.replace(/^\/m/, ''), t, lang);
  const title = crumbs[crumbs.length - 1];

  const goDesktop = () => {
    setMobileMode(false);
    (window.top || window).location.assign(path.replace(/^\/m/, '') || '/dashboard'); // leave the phone outline too
  };

  const sections = NAV.flatMap((node) => {
    if (node.type === 'group') return [{ heading: t(node.labelKey), items: node.items }];
    return [{ heading: null, items: [node] }];
  });
  // Merge the single links into one list so the sheet isn't a pile of one-row sections.
  const grouped = [];
  const singles = [];
  sections.forEach((s) => (s.heading ? grouped.push(s) : singles.push(...s.items)));

  return (
    <div style={styles.shell}>
      <header style={styles.top}>
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
      <main style={styles.main}>
        <Outlet />
      </main>

      <nav style={styles.tabBar} aria-label={hi ? 'मुख्य मेनू' : 'Main menu'}>
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
        <div style={styles.overlay} onClick={() => setMoreOpen(false)}>
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

const BAR = 62; // tab bar height, not counting the phone's bottom safe area

const styles = {
  shell: { minHeight: '100dvh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', boxShadow: '0 0 0 1px var(--border-color), 0 0 40px rgba(0,0,0,0.08)', position: 'relative' },
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
    position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '100%', bottom: 0, zIndex: 30, display: 'flex',
    height: `calc(${BAR}px + env(safe-area-inset-bottom))`, paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)', boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
  },
  tab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: '0.72rem', fontFamily: 'inherit', background: 'none', border: 'none', minWidth: 0 },
  overlay: { position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(30,20,50,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  sheet: {
    width: '100%', maxHeight: '85dvh', overflowY: 'auto', backgroundColor: 'var(--surface)', borderRadius: '20px 20px 0 0',
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
