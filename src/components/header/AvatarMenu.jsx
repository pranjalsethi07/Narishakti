import { useCallback, useRef, useState } from 'react';
import { appUrl } from '../../utils/appMode';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Globe, LogIn, LogOut, User, UserPlus, Trash2 } from 'lucide-react';
import { useDismiss } from './useDismiss';
import { useUserPhoto } from '../../utils/userPhoto';
import { accountsEnabled, useAuth, signOutDevice } from '../../lib/auth';
import { confirmSignOut, confirmClearDevice } from '../../lib/signOutWarning';

// Your photo (or initials) with a dropdown. Signed in: profile, language, sign out.
// Guest: sign in or create an account, language, and clearing this device.
const AvatarMenu = ({ lang, setLang, t }) => {
  const navigate = useNavigate();
  const photo = useUserPhoto();
  const hi = lang === 'hi';
  const auth = useAuth();
  const isGuest = accountsEnabled && auth.status === 'signedOut';
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrapRef, open, close);

  const name = (localStorage.getItem('userName') || '').trim();
  const initials = name ? name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() : 'NS';

  const goProfile = () => {
    setOpen(false);
    navigate('/dashboard/profile');
  };

  const goAuth = (mode) => {
    setOpen(false);
    navigate(`/?mode=${mode}`);
  };

  // Signing out only leaves this device. Her account and progress stay safe on the server.
  const logout = async () => {
    if (!confirmSignOut(lang)) return;
    await signOutDevice();
    localStorage.clear();
    window.location.href = appUrl('/');
  };

  // A guest has no account, so clearing the device is the only way to "leave".
  const clearGuestData = () => {
    if (!confirmClearDevice(lang)) return;
    localStorage.clear();
    window.location.href = appUrl('/');
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={hi ? 'अकाउंट मेनू' : 'Account menu'}
      >
        <span style={styles.avatar}>
          {photo
            ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: '#fff', fontWeight: 'bold' }}>{initials}</span>}
        </span>
        <ChevronDown size={16} color="var(--text-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={styles.panel} role="menu" className="pop-in">
          <div style={styles.who}>
            <strong style={{ fontSize: '1rem' }}>{name || (hi ? 'दीदी' : 'Didi')}</strong>
            <span className="subtext" style={{ fontSize: '0.85rem' }}>
              {isGuest ? (hi ? 'गेस्ट' : 'Guest') : (auth.username ? `@${auth.username}` : (hi ? 'आपका अकाउंट' : 'Your account'))}
            </span>
          </div>

          {isGuest ? (
            <>
              <button type="button" role="menuitem" style={styles.row} onClick={() => goAuth('signin')}>
                <LogIn size={18} color="var(--primary)" /> {hi ? 'साइन इन करें' : 'Sign in'}
              </button>
              <button type="button" role="menuitem" style={styles.row} onClick={() => goAuth('signup')}>
                <UserPlus size={18} color="var(--primary)" /> {hi ? 'अकाउंट बनाएं' : 'Create account'}
              </button>
            </>
          ) : (
            <button type="button" role="menuitem" style={styles.row} onClick={goProfile}>
              <User size={18} color="var(--primary)" /> {t('profile')}
            </button>
          )}

          <div style={styles.langBlock}>
            <span style={styles.langLabel}><Globe size={16} /> {hi ? 'भाषा' : 'Language'}</span>
            <div style={styles.langRow}>
              {[['en', 'English'], ['hi', 'हिंदी']].map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={lang === code}
                  onClick={() => setLang(code)}
                  style={{ ...styles.langBtn, ...(lang === code ? styles.langBtnOn : {}) }}
                >
                  {lang === code && <Check size={14} />} {label}
                </button>
              ))}
            </div>
          </div>

          {isGuest ? (
            <button type="button" role="menuitem" style={{ ...styles.row, color: 'var(--danger)' }} onClick={clearGuestData}>
              <Trash2 size={18} /> {hi ? 'इस डिवाइस का डेटा साफ़ करें' : 'Clear data on this device'}
            </button>
          ) : (
            <button type="button" role="menuitem" style={{ ...styles.row, color: 'var(--danger)' }} onClick={logout}>
              <LogOut size={18} /> {hi ? 'साइन आउट' : 'Sign out'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  trigger: { display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontFamily: 'inherit' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  panel: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 'min(280px, 90vw)', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 16px 40px rgba(0,0,0,0.18)', zIndex: 60, overflow: 'hidden' },
  who: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '14px 16px', borderBottom: '1px solid var(--border-color)' },
  row: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-dark)', textAlign: 'left' },
  langBlock: { padding: '10px 16px 14px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' },
  langLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' },
  langRow: { display: 'flex', gap: '8px' },
  langBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontSize: '0.9rem', color: 'var(--text-dark)', backgroundColor: 'var(--surface)' },
  langBtnOn: { backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary-dark)', fontWeight: '600' },
};

export default AvatarMenu;
