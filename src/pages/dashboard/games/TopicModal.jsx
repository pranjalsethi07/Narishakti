import { useEffect, useRef } from 'react';
import { Shuffle, HeartPulse, Wallet, X } from 'lucide-react';
import { TOPICS } from '../../../data/gamesData';

const OPTIONS = [
  { key: 'mix', icon: Shuffle, descKey: 'mixedDesc' },
  { key: 'health', icon: HeartPulse, descKey: 'healthDesc' },
  { key: 'finance', icon: Wallet, descKey: 'financeDesc' },
];

// Popup asking which topic to play: mixed, health only, or finance only.
const TopicModal = ({ gameTitle, current, lang, ui, onSelect, onClose }) => {
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-modal-title"
        style={styles.dialog}
        className="pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} style={styles.close} aria-label={ui.close}>
          <X size={20} />
        </button>
        <p className="subtext">{gameTitle}</p>
        <h2 id="topic-modal-title" className="h3" style={{ marginBottom: '4px' }}>{ui.chooseTopic}</h2>
        <p className="subtext" style={{ marginBottom: '20px' }}>{ui.chooseTopicSub}</p>

        <div style={styles.options}>
          {OPTIONS.map(({ key, icon, descKey }, i) => {
            const Icon = icon;
            const t = TOPICS[key];
            const active = current === key;
            return (
              <button
                key={key}
                ref={i === 0 ? firstRef : null}
                type="button"
                onClick={() => onSelect(key)}
                style={{ ...styles.option, backgroundColor: t.bg, borderColor: active ? t.color : 'transparent' }}
              >
                <span style={{ ...styles.optionIcon, backgroundColor: t.color }}>
                  <Icon color="#fff" size={22} />
                </span>
                <span style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-dark)' }}>{t.label[lang]}</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ui[descKey]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(26, 18, 40, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 },
  dialog: { position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' },
  close: { position: 'absolute', top: '14px', right: '14px', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
  options: { display: 'flex', flexDirection: 'column', gap: '12px' },
  option: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '2px solid', fontFamily: 'inherit', cursor: 'pointer' },
  optionIcon: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

export default TopicModal;
