import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/languageContextValue';
import { Mic, Globe, Play } from 'lucide-react';

const TopNav = () => {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <div style={styles.inputWrapper}>
          <input 
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button style={styles.micBtn} className="mic-pulse">
            <Mic size={20} color="#fff" />
          </button>
        </div>

        <button className="btn btn-secondary" style={styles.playBtn}>
          <Play size={16} />
          {t("playVoice")}
        </button>
      </div>

      <div style={styles.actions}>
        <div style={styles.langToggleBox}>
          <Globe size={16} color="var(--text-muted)" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={styles.langSelect}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>
        <button
          type="button"
          style={styles.avatar}
          onClick={() => navigate('/dashboard/profile')}
          title={t('profile')}
          aria-label={t('profile')}
        >
          <span style={{ color: 'white', fontWeight: 'bold' }}>NS</span>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 },
  searchContainer: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '600px' },
  inputWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '12px 20px', paddingRight: '50px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
  micBtn: { position: 'absolute', right: '6px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' },
  playBtn: { padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' },
  actions: { display: 'flex', alignItems: 'center', gap: '16px' },
  langToggleBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' },
  langSelect: { border: 'none', backgroundColor: 'transparent', outline: 'none', fontWeight: '600', color: 'var(--primary-dark)', cursor: 'pointer' },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }
};

export default TopNav;
