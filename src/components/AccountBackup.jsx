import { useEffect, useRef, useState } from 'react';
import { appUrl } from '../utils/appMode';
import { Cloud, CloudOff, KeyRound, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/languageContextValue';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  useSyncStatus, syncNowManually, createRecoveryCode, getRecoveryCodeDate, deleteMyData,
} from '../lib/sync';

const TEXT = {
  en: {
    title: 'Backup & recovery',
    off: 'Cloud backup is not set up in this version of the app.',
    idle: 'Starting backup...',
    syncing: 'Saving your progress...',
    synced: (when) => `Backed up${when ? ` · ${when}` : ''}`,
    offline: "You're offline. Progress will be saved when you're back online.",
    error: "Couldn't back up just now. We'll try again.",
    retry: 'Try again',
    anonNote: 'Your progress is saved to your account (username and PIN). We never store your phone number, email or name.',
    guest: 'Guest mode: nothing is backed up.',
    noCode: "No recovery code yet. If you forget your PIN, a recovery code is the only way to get your progress back.",
    hasCode: (date) => `Recovery code made on ${date}.`,
    create: 'Create recovery code',
    renew: 'Make a new code',
    confirmRenew: 'This makes a new code. Your old code will stop working. Continue?',
    yourCode: 'Your recovery code',
    showOnce: 'Write it down or take a screenshot now. It is shown only once, and nobody can look it up for you.',
    copy: 'Copy',
    copied: 'Copied',
    saved: "I've saved it",
    restoreTitle: 'Restore on this phone',
    restoreHint: 'Enter the recovery code from your other phone. Your progress from both is combined.',
    codePlaceholder: 'XXXXX-XXXXX-XXXXX-XXXXX',
    restore: 'Restore',
    notFound: "That code wasn't recognised. Check it and try again.",
    tooShort: 'Please enter the full recovery code.',
    restored: 'Restored. Reloading...',
    failed: 'Something went wrong. Please try again.',
    del: 'Delete my online data',
    delHint: 'Removes your backup and recovery code from our servers and clears this phone.',
    confirmDelete: 'Delete your online backup and clear all data on this phone? This cannot be undone.',
  },
  hi: {
    title: 'बैकअप और रिकवरी',
    off: 'ऐप के इस संस्करण में क्लाउड बैकअप चालू नहीं है।',
    idle: 'बैकअप शुरू हो रहा है...',
    syncing: 'आपकी प्रगति सेव हो रही है...',
    synced: (when) => `बैकअप हो गया${when ? ` · ${when}` : ''}`,
    offline: 'आप ऑफ़लाइन हैं। इंटरनेट आने पर प्रगति सेव हो जाएगी।',
    error: 'अभी बैकअप नहीं हो पाया। हम फिर कोशिश करेंगे।',
    retry: 'फिर कोशिश करें',
    anonNote: 'आपकी प्रगति आपके अकाउंट (यूज़रनेम और पिन) में सेव होती है। हम आपका फ़ोन नंबर, ईमेल या नाम कभी सेव नहीं करते।',
    guest: 'गेस्ट मोड: कुछ भी बैकअप नहीं होता।',
    noCode: 'अभी कोई रिकवरी कोड नहीं है। अगर आप पिन भूल गईं, तो प्रगति वापस पाने का यही एकमात्र तरीका है।',
    hasCode: (date) => `रिकवरी कोड ${date} को बना था।`,
    create: 'रिकवरी कोड बनाएं',
    renew: 'नया कोड बनाएं',
    confirmRenew: 'इससे नया कोड बनेगा और पुराना कोड काम करना बंद कर देगा। जारी रखें?',
    yourCode: 'आपका रिकवरी कोड',
    showOnce: 'इसे अभी लिख लें या स्क्रीनशॉट ले लें। यह सिर्फ़ एक बार दिखता है और कोई इसे दोबारा नहीं निकाल सकता।',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया',
    saved: 'मैंने सेव कर लिया',
    restoreTitle: 'इस फ़ोन पर वापस लाएं',
    restoreHint: 'अपने दूसरे फ़ोन का रिकवरी कोड डालें। दोनों फ़ोन की प्रगति जुड़ जाएगी।',
    codePlaceholder: 'XXXXX-XXXXX-XXXXX-XXXXX',
    restore: 'वापस लाएं',
    notFound: 'यह कोड पहचाना नहीं गया। जांचकर फिर कोशिश करें।',
    tooShort: 'कृपया पूरा रिकवरी कोड डालें।',
    restored: 'वापस आ गया। रीलोड हो रहा है...',
    failed: 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
    del: 'मेरा ऑनलाइन डेटा हटाएं',
    delHint: 'आपका बैकअप और रिकवरी कोड हमारे सर्वर से हटा देता है और इस फ़ोन को साफ़ करता है।',
    confirmDelete: 'ऑनलाइन बैकअप हटाएं और इस फ़ोन का सारा डेटा साफ़ करें? इसे वापस नहीं लाया जा सकता।',
  },
};

const AccountBackup = () => {
  const { lang } = useLanguage();
  const ui = TEXT[lang];
  const status = useSyncStatus();

  const [codeDate, setCodeDate] = useState(undefined); // undefined = still loading, null = none yet
  const [newCode, setNewCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ kind: '', text: '' });
  const copyTimer = useRef(null);

  // Once the first backup has run, ask whether a recovery code already exists.
  const ready = status.state === 'synced';
  useEffect(() => {
    if (!ready) return undefined;
    let cancelled = false;
    getRecoveryCodeDate()
      .then((date) => { if (!cancelled) setCodeDate(date); })
      .catch(() => { if (!cancelled) setCodeDate(null); });
    return () => { cancelled = true; };
  }, [ready]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const fail = (text) => setMessage({ kind: 'error', text });
  const formatDate = (date) => date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = (ms) => new Date(ms).toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' });

  const handleCreate = async () => {
    if (codeDate && !window.confirm(ui.confirmRenew)) return;
    setBusy(true);
    setMessage({ kind: '', text: '' });
    try {
      const code = await createRecoveryCode();
      setNewCode(code);
      setCodeDate(new Date());
    } catch {
      fail(ui.failed);
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: she can still read the code on screen
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(ui.confirmDelete)) return;
    setBusy(true);
    try {
      await deleteMyData();
      localStorage.clear();
      window.location.href = appUrl('/');
    } catch {
      fail(ui.failed);
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}><CloudOff size={20} color="var(--text-light)" /> {ui.title}</h3>
        <p className="subtext">{ui.off}</p>
      </div>
    );
  }

  const statusText = {
    idle: ui.idle,
    syncing: ui.syncing,
    synced: ui.synced(status.lastSyncedAt ? formatTime(status.lastSyncedAt) : ''),
    offline: ui.offline,
    error: ui.error,
  }[status.state] || ui.idle;
  const statusColor = status.state === 'synced' ? 'var(--success)' : status.state === 'error' ? 'var(--danger)' : 'var(--text-muted)';

  return (
    <div style={styles.card}>
      <h3 style={styles.title}><Cloud size={20} color="var(--primary)" /> {ui.title}</h3>

      <div style={{ ...styles.statusRow, color: statusColor }} role="status">
        <span style={{ ...styles.dot, backgroundColor: statusColor }} />
        {statusText}
        {(status.state === 'error' || status.state === 'offline') && (
          <button type="button" style={styles.linkBtn} onClick={syncNowManually}>
            <RefreshCw size={14} /> {ui.retry}
          </button>
        )}
      </div>
      <p className="subtext" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>{ui.anonNote}</p>

      <div style={styles.block}>
        <p style={{ fontSize: '0.92rem', marginBottom: '10px' }}>
          {codeDate ? ui.hasCode(formatDate(codeDate)) : codeDate === null ? ui.noCode : '...'}
        </p>
        <button type="button" className="btn btn-secondary" style={styles.smallBtn} onClick={handleCreate} disabled={busy || !ready}>
          <KeyRound size={16} /> {codeDate ? ui.renew : ui.create}
        </button>

        {newCode && (
          <div style={styles.codeBox} role="alert">
            <strong style={{ fontSize: '0.85rem' }}>{ui.yourCode}</strong>
            <div style={styles.code}>{newCode}</div>
            <p style={{ fontSize: '0.82rem', margin: '6px 0 10px' }}>{ui.showOnce}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" style={styles.smallBtn} onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? ui.copied : ui.copy}
              </button>
              <button type="button" className="btn btn-primary" style={styles.smallBtn} onClick={() => setNewCode('')}>
                {ui.saved}
              </button>
            </div>
          </div>
        )}
      </div>

      {message.text && (
        <p style={{ color: message.kind === 'ok' ? 'var(--success)' : 'var(--danger)', fontWeight: '500', margin: '12px 0 0', fontSize: '0.9rem' }} role="status">
          {message.text}
        </p>
      )}

      <div style={{ ...styles.block, borderBottom: 'none', paddingBottom: 0, marginTop: '14px' }}>
        <button type="button" style={styles.dangerBtn} onClick={handleDelete} disabled={busy}>
          <Trash2 size={15} /> {ui.del}
        </button>
        <p className="subtext" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{ui.delHint}</p>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' },
  title: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-dark)' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontWeight: '600', fontSize: '0.92rem', marginBottom: '6px' },
  dot: { width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0 },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary-dark)', fontWeight: '600', fontSize: '0.85rem', fontFamily: 'inherit' },
  block: { paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid var(--border-color)' },
  smallBtn: { padding: '8px 14px', fontSize: '0.9rem' },
  codeBox: { marginTop: '12px', padding: '14px', backgroundColor: '#fffbeb', border: '1px solid #f6e05e', borderRadius: 'var(--radius-md)' },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.06em', margin: '6px 0', wordBreak: 'break-all', color: 'var(--text-dark)' },
  disclosure: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--primary-dark)', fontFamily: 'inherit', fontSize: '0.95rem' },
  input: { flex: 1, minWidth: 0, border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 10px', fontSize: '0.95rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', backgroundColor: 'var(--bg-color)', color: 'var(--text-dark)', outline: 'none' },
  dangerBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: '600', fontFamily: 'inherit', fontSize: '0.9rem' },
};

export default AccountBackup;
