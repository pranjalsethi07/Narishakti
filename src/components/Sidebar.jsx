import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';
import { LayoutDashboard, BookOpen, HelpCircle, Target, Users, Landmark, FileText, User, Activity, Stethoscope, Briefcase } from 'lucide-react';
import Logo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

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
    { name: t("tracker"), path: '/dashboard/tracker', icon: Activity },
    { name: t("docScanner"), path: '/dashboard/scanner', icon: FileText },
    { name: t("profile"), path: '/dashboard/profile', icon: User },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <Logo width={120} showText={true} />
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
            end={item.path === '/dashboard'} // Dashboard home only matches exact
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={styles.whatsappCard}>
        <h4>💬 {lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{lang === 'hi' ? 'मिस्ड कॉल दें!' : 'Give a missed call!'}</p>
        <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '8px' }} onClick={() => navigate('/dashboard/whatsapp')}>
          {lang === 'hi' ? 'कनेक्ट करें' : 'Connect'}
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: { width: '260px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 },
  header: { padding: '24px', borderBottom: '1px solid var(--border-color)' },
  nav: { flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' },
  link: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', transition: 'background-color 0.2s, color 0.2s' },
  activeLink: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' },
  whatsappCard: { margin: '16px', padding: '16px', backgroundColor: '#e6ffe6', borderRadius: 'var(--radius-md)', border: '1px solid #b3ffb3', textAlign: 'center' }
};

export default Sidebar;
