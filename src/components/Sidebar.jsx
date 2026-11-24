import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';
import { LayoutDashboard, BookOpen, HelpCircle, Target, Users, Landmark, FileText, User, Activity, Stethoscope, Briefcase, PanelLeftClose, PanelLeftOpen, MessageCircle, Gamepad2 } from 'lucide-react';
import Logo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname.replace(/\/+$/, '') === '/dashboard';

  // Open on the dashboard home, collapsed inside any section.
  // The toggle button still overrides this until the next page change.
  const [collapsed, setCollapsed] = useState(!isHome);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setCollapsed(!isHome);
  }

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const toggleLabel = collapsed
    ? (lang === 'hi' ? 'मेनू खोलें' : 'Expand menu')
    : (lang === 'hi' ? 'मेनू छोटा करें' : 'Collapse menu');

  const navItems = [
    { name: t("dashboard"), path: '/dashboard', icon: LayoutDashboard },
    { name: t("askAI"), path: '/dashboard/ask', icon: HelpCircle },
    { name: t("learn"), path: '/dashboard/learn', icon: BookOpen },
    { name: t("aajKaSawaal"), path: '/dashboard/daily-question', icon: Target },
    { name: t("testKnowledge"), path: '/dashboard/test', icon: Target },
    { name: t("community"), path: '/dashboard/community', icon: Users },
    { name: t("schemes"), path: '/dashboard/schemes', icon: Landmark },
    { name: t("digitalDoctor"), path: '/dashboard/digital-doctor', icon: Stethoscope },
    { name: t("opportunitiesWomen"), path: '/dashboard/opportunities-women', icon: Briefcase },
    { name: t("games"), path: '/dashboard/games', icon: Gamepad2 },
    { name: t("tracker"), path: '/dashboard/tracker', icon: Activity },
    { name: t("docScanner"), path: '/dashboard/scanner', icon: FileText },
    { name: t("profile"), path: '/dashboard/profile', icon: User },
  ];

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? '76px' : '260px' }}>
      <div style={{ ...styles.header, padding: collapsed ? '16px 8px' : '24px' }}>
        <Logo width={collapsed ? 48 : 120} showText={!collapsed} />
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        style={{ ...styles.toggleBtn, alignSelf: collapsed ? 'center' : 'flex-end', margin: collapsed ? '12px 0 0' : '12px 16px 0' }}
        title={toggleLabel}
        aria-label={toggleLabel}
        aria-expanded={!collapsed}
      >
        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>

      <nav style={{ ...styles.nav, padding: collapsed ? '12px 10px' : '16px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            aria-label={item.name}
            style={({ isActive }) => ({
              ...styles.link,
              ...(collapsed ? styles.linkCollapsed : {}),
              ...(isActive ? styles.activeLink : {}),
            })}
            end={item.path === '/dashboard'} // Dashboard home only matches exact
          >
            <item.icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>

      {collapsed ? (
        <button
          type="button"
          style={styles.whatsappIconBtn}
          onClick={() => navigate('/dashboard/whatsapp')}
          title={lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
          aria-label={lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
        >
          <MessageCircle size={20} />
        </button>
      ) : (
        <div style={styles.whatsappCard}>
          <h4>💬 {lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{lang === 'hi' ? 'मिस्ड कॉल दें!' : 'Give a missed call!'}</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '8px' }} onClick={() => navigate('/dashboard/whatsapp')}>
            {lang === 'hi' ? 'कनेक्ट करें' : 'Connect'}
          </button>
        </div>
      )}
    </aside>
  );
};

const styles = {
  sidebar: { width: '260px', flexShrink: 0, backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflow: 'hidden', transition: 'width 0.25s ease' },
  toggleBtn: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' },
  linkCollapsed: { justifyContent: 'center', padding: '12px 0', gap: 0 },
  whatsappIconBtn: { margin: '16px auto', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6ffe6', border: '1px solid #b3ffb3', color: '#1a7f3c' },
  header: { padding: '24px', borderBottom: '1px solid var(--border-color)' },
  nav: { flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' },
  link: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', transition: 'background-color 0.2s, color 0.2s' },
  activeLink: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' },
  whatsappCard: { margin: '16px', padding: '16px', backgroundColor: '#e6ffe6', borderRadius: 'var(--radius-md)', border: '1px solid #b3ffb3', textAlign: 'center' }
};

export default Sidebar;
