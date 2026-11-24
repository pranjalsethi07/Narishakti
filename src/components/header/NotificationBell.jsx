import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, BookOpen, Flame, Lightbulb, UserCog } from 'lucide-react';
import { useDismiss } from './useDismiss';
import { getContinueLearningMeta, getStoredLearnProgress } from '../../utils/learningProgress';

const READ_KEY = 'notifReadIds';

const readStored = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Reminders built from what you have actually done. Nothing is sent from a server.
const NotificationBell = ({ lang, streak }) => {
  const navigate = useNavigate();
  const hi = lang === 'hi';
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(readStored);
  const [today] = useState(dayKey);
  const wrapRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrapRef, open, close);

  const learn = getContinueLearningMeta(getStoredLearnProgress());
  const profileDone = localStorage.getItem('profileComplete') === 'true';

  const items = [
    {
      id: `daily-${today}`, icon: Lightbulb, color: '#b7791f', bg: '#fef3c7', path: '/dashboard/daily-question',
      title: hi ? 'आज का सवाल तैयार है' : "Today's Aaj Ka Sawaal is ready",
      text: hi ? 'एक नया सवाल हल करें' : 'Answer a new question',
    },
    ...(streak >= 2 ? [{
      id: `streak-${today}`, icon: Flame, color: '#dd6b20', bg: '#feebc8', path: '/dashboard/progress',
      title: hi ? `${streak} दिन की स्ट्रीक!` : `${streak}-day streak!`,
      text: hi ? 'कल भी आएं और इसे जारी रखें' : 'Come back tomorrow to keep it going',
    }] : []),
    ...(learn.completionPercent < 100 ? [{
      id: `learn-${learn.category}-${learn.moduleNumber}`, icon: BookOpen, color: '#2c7a7b', bg: '#e6fffa', path: '/dashboard/learn',
      title: hi ? 'सीखना जारी रखें' : 'Continue learning',
      text: learn.module?.title || '',
    }] : []),
    ...(!profileDone ? [{
      id: 'profile', icon: UserCog, color: '#805ad5', bg: '#faf5ff', path: '/dashboard/profile',
      title: hi ? 'अपनी प्रोफ़ाइल पूरी करें' : 'Complete your profile',
      text: hi ? 'योजनाओं की पात्रता जांचने के लिए' : 'Needed to check scheme eligibility',
    }] : []),
  ];

  const unread = items.filter((i) => !readIds.includes(i.id));

  const saveRead = (ids) => {
    const next = [...new Set([...readIds, ...ids])].slice(-60);
    setReadIds(next);
    try { localStorage.setItem(READ_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  };

  const openItem = (item) => {
    saveRead([item.id]);
    setOpen(false);
    navigate(item.path);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={styles.bellBtn}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={hi ? `सूचनाएं, ${unread.length} नई` : `Notifications, ${unread.length} new`}
        title={hi ? 'सूचनाएं' : 'Notifications'}
      >
        <Bell size={20} />
        {unread.length > 0 && <span style={styles.badge}>{unread.length}</span>}
      </button>

      {open && (
        <div style={styles.panel} role="menu" className="pop-in">
          <div style={styles.panelHead}>
            <strong>{hi ? 'सूचनाएं' : 'Notifications'}</strong>
            {unread.length > 0 && (
              <button type="button" style={styles.markAll} onClick={() => saveRead(items.map((i) => i.id))}>
                {hi ? 'सब पढ़ा हुआ करें' : 'Mark all read'}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div style={styles.empty}>
              <BellOff size={28} color="var(--text-light)" />
              <span>{hi ? 'अभी कुछ नया नहीं है' : "You're all caught up"}</span>
            </div>
          ) : (
            items.map((item) => {
              const Icon = item.icon;
              const isUnread = !readIds.includes(item.id);
              return (
                <button key={item.id} type="button" role="menuitem" style={styles.item} onClick={() => openItem(item)}>
                  <span style={{ ...styles.itemIcon, backgroundColor: item.bg }}><Icon size={18} color={item.color} /></span>
                  <span style={{ flex: 1, textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-dark)' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.text}</span>
                  </span>
                  {isUnread && <span style={styles.dot} aria-label={hi ? 'नया' : 'New'} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  bellBtn: { position: 'relative', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' },
  badge: { position: 'absolute', top: '-3px', right: '-3px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '999px', backgroundColor: 'var(--danger)', color: '#fff', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' },
  panel: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 'min(340px, 90vw)', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 16px 40px rgba(0,0,0,0.18)', zIndex: 60, overflow: 'hidden' },
  panelHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border-color)' },
  markAll: { fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: '600', fontFamily: 'inherit' },
  item: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', fontFamily: 'inherit', borderBottom: '1px solid var(--border-color)' },
  itemIcon: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dot: { width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '28px 16px', color: 'var(--text-muted)' },
};

export default NotificationBell;
