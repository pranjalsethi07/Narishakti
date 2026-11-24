import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Mic, Search, Globe, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { useMediaQuery } from '../utils/useMediaQuery';
import { recordDailyActivity } from '../utils/userProgress';
import { getLevelInfo } from '../utils/levels';
import { getCrumbs } from './navConfig';
import NotificationBell from './header/NotificationBell';
import AvatarMenu from './header/AvatarMenu';
import SosButton from './sos/SosButton';

const TopNav = ({ isMobile = false, onMenuClick = () => {} }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLanguage();
  const hi = lang === 'hi';
  const wide = useMediaQuery('(min-width: 1100px)');
  const [query, setQuery] = useState('');
  // Count today as an active day as soon as the dashboard opens (safe to repeat).
  const [streak] = useState(() => recordDailyActivity());

  const level = getLevelInfo();
  const crumbs = getCrumbs(pathname, t, lang);
  const title = crumbs[crumbs.length - 1];

  // Both the search box and the mic hand your question over to Ask AI.
  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/dashboard/ask?q=${encodeURIComponent(q)}` : '/dashboard/ask');
    setQuery('');
  };
  const startVoice = () => navigate('/dashboard/ask?voice=1');

  return (
    <header style={{ ...styles.header, padding: isMobile ? '10px 14px' : '14px 32px' }}>
      <div style={styles.left}>
        {isMobile && (
          <button type="button" style={styles.menuBtn} onClick={onMenuClick} aria-label={hi ? 'मेनू खोलें' : 'Open menu'}>
            <Menu size={22} />
          </button>
        )}
        <nav aria-label={hi ? 'आप यहां हैं' : 'You are here'} style={styles.crumbs}>
          {!isMobile && crumbs.length > 1 && (
            <>
              <span style={styles.crumbParent}>{crumbs[0]}</span>
              <ChevronRight size={16} color="var(--text-light)" />
            </>
          )}
          <h1 style={styles.title} aria-current="page">{title}</h1>
        </nav>
      </div>

      <form role="search" onSubmit={submitSearch} style={{ ...styles.searchForm, ...(isMobile ? styles.searchMobile : {}) }}>
        <Search size={18} color="var(--text-light)" style={styles.searchIcon} aria-hidden="true" />
        <input
          type="text"
          aria-label={hi ? 'AI से पूछें' : 'Ask AI'}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="button" style={styles.micBtn} onClick={startVoice} aria-label={hi ? 'बोलकर पूछें' : 'Ask by voice'} title={hi ? 'बोलकर पूछें' : 'Ask by voice'}>
          <Mic size={18} color="#fff" />
        </button>
      </form>

      <div style={{ ...styles.actions, ...(isMobile ? { marginLeft: 'auto' } : {}) }}>
        {wide && (
          <>
            <button type="button" style={{ ...styles.chip, color: '#c05621', backgroundColor: '#fffaf0', borderColor: '#feebc8' }} onClick={() => navigate('/dashboard/progress')} title={hi ? 'आपकी स्ट्रीक' : 'Your streak'}>
              <Flame size={16} color="#dd6b20" /> {streak}
            </button>
            <button
              type="button"
              style={{ ...styles.chip, color: '#276749', backgroundColor: '#f0fff4', borderColor: '#c6f6d5' }}
              onClick={() => navigate('/dashboard/progress')}
              title={level.next
                ? (hi ? `${level.xp} XP · ${level.next.name.hi} तक ${level.toNext} XP और` : `${level.xp} XP · ${level.toNext} XP to ${level.next.name.en}`)
                : `${level.xp} XP`}
            >
              <TrendingUp size={16} /> {hi ? `स्तर ${level.level}` : `Lvl ${level.level}`}
            </button>
          </>
        )}

        {!isMobile && (
          <button
            type="button"
            style={styles.langBtn}
            onClick={() => setLang(hi ? 'en' : 'hi')}
            aria-label={hi ? 'Switch to English' : 'हिंदी में बदलें'}
            title={hi ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe size={16} color="var(--text-muted)" /> {hi ? 'हिं' : 'EN'}
          </button>
        )}

        {/* on phones the menu (with its SOS button) is a hidden drawer, so SOS sits in the header too */}
        {isMobile && <SosButton variant="header" />}
        <NotificationBell lang={lang} streak={streak} />
        <AvatarMenu lang={lang} setLang={setLang} t={t} />
      </div>
    </header>
  );
};

const styles = {
  header: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px 20px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 },
  left: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 },
  menuBtn: { width: '40px', height: '40px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' },
  crumbs: { display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 },
  crumbParent: { color: 'var(--text-muted)', fontSize: '0.95rem' },
  title: { fontFamily: 'inherit', fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  searchForm: { position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 320px', maxWidth: '520px', marginLeft: 'auto' },
  searchMobile: { order: 3, flex: '1 1 100%', maxWidth: 'none', marginLeft: 0 },
  searchIcon: { position: 'absolute', left: '16px', pointerEvents: 'none' },
  input: { width: '100%', padding: '11px 52px 11px 42px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' },
  micBtn: { position: 'absolute', right: '5px', width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' },
  actions: { display: 'flex', alignItems: 'center', gap: '12px' },
  chip: { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: 'var(--radius-full)', border: '1px solid', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'inherit' },
  langBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary-dark)', fontFamily: 'inherit' },
};

export default TopNav;
