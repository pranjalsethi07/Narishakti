import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { accountsEnabled, useAuth } from '../lib/auth';
import { lockedInfoFor } from '../lib/guestAccess';

// Wrap a page in this to keep guests out. Signed-in users (or builds with no accounts set up)
// see the page. Guests see a friendly "sign in to use this" screen instead.
const RequireAccount = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const auth = useAuth();
  const hi = lang === 'hi';

  if (!accountsEnabled || auth.status === 'signedIn') return children;
  if (auth.status === 'loading') return null; // still checking for a saved sign-in; avoid a flash

  const info = lockedInfoFor(pathname);

  return (
    <div className="fade-in" style={styles.wrap}>
      <div style={styles.card}>
        <span style={styles.lockCircle}><Lock size={30} color="var(--primary)" /></span>
        <h1 className="h2" style={{ marginBottom: '8px' }}>
          {hi ? `${info?.label.hi || 'इस फ़ीचर'} के लिए साइन इन करें` : `Sign in to use ${info?.label.en || 'this feature'}`}
        </h1>
        <p className="subtext" style={{ fontSize: '1rem', maxWidth: '46ch', margin: '0 auto 24px' }}>
          {info ? info.why[lang] : (hi ? 'इस हिस्से के लिए अकाउंट चाहिए।' : 'This part needs an account.')}
        </p>
        <div style={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/?mode=signin')}>
            {hi ? 'साइन इन करें' : 'Sign in'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/?mode=signup')}>
            {hi ? 'अकाउंट बनाएं' : 'Create account'}
          </button>
        </div>
        <p className="subtext" style={{ fontSize: '0.85rem', marginTop: '16px' }}>
          {hi ? 'सिर्फ़ एक यूज़रनेम और 6 अंकों का पिन। फ़ोन नंबर या ईमेल नहीं।' : 'Just a username and a 6-digit PIN. No phone number or email.'}
        </p>
        <button type="button" style={styles.back} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> {hi ? 'डैशबोर्ड पर वापस' : 'Back to the dashboard'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', padding: '24px 0' },
  card: { maxWidth: '560px', width: '100%', textAlign: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '40px 28px' },
  lockCircle: { width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  back: { display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', color: 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.95rem' },
};

export default RequireAccount;
