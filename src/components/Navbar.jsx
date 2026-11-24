import React from 'react';
import { useLanguage } from '../context/languageContextValue';
import { Globe } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();

  return (
    <nav style={styles.nav}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo width={70} showText={true} />
      </div>
      <div style={styles.links}>
        <a href="#about" style={styles.link}>{t('aboutUsNav')}</a>
        <a href="#shop" style={styles.link}>{t('shopNav')}</a>
        <a href="#stories" style={styles.link}>{t('testimonialsNav')}</a>
        
        <div style={styles.langToggleBox}>
          <Globe size={16} color="var(--primary)" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={styles.langSelect}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '10px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: 'var(--shadow-sm)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoMark: {
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--primary)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'var(--text-dark)',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  langToggleBox: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '6px 12px', 
    backgroundColor: 'var(--primary-light)', 
    borderRadius: 'var(--radius-full)' 
  },
  langSelect: { 
    border: 'none', 
    backgroundColor: 'transparent', 
    outline: 'none', 
    fontWeight: '600', 
    color: 'var(--primary-dark)', 
    cursor: 'pointer' 
  }
};

export default Navbar;
