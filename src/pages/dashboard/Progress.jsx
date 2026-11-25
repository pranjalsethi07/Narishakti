import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/languageContextValue';
import { Flame, TrendingUp, ArrowLeft, BookOpen, Gamepad2, MessageCircle, Check, Lock } from 'lucide-react';
import { LEVELS, XP_RULES, getLevelInfo } from '../../utils/levels';
import { getDayStreakCount, getQuestionsAskedCount, getTopicsCompletedCount } from '../../utils/userProgress';
import { getProgress, totalBadges } from '../../data/gamesData';

// Read-only: everything here is worked out from what you actually do in the app.
const read = () => ({
  info: getLevelInfo(),
  streak: getDayStreakCount(),
  lessons: getTopicsCompletedCount(),
  badges: totalBadges(getProgress()),
  questions: getQuestionsAskedCount(),
});

const Progress = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const [data, setData] = useState(read);

  useEffect(() => {
    const refresh = () => setData(read());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('naari-progress-synced', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('naari-progress-synced', refresh);
    };
  }, []);

  const { info, streak, lessons, badges, questions } = data;
  const name = (n) => (hi ? n.hi : n.en);

  const sources = [
    { icon: BookOpen, color: '#1f9e8c', label: hi ? 'पूरे किए पाठ' : 'Lessons completed', count: lessons, xp: lessons * XP_RULES.lesson, rule: hi ? `हर पाठ पर ${XP_RULES.lesson} XP` : `${XP_RULES.lesson} XP each` },
    { icon: Gamepad2, color: '#e53e3e', label: hi ? 'गेम बैज' : 'Game badges', count: badges, xp: badges * XP_RULES.badge, rule: hi ? `हर बैज पर ${XP_RULES.badge} XP` : `${XP_RULES.badge} XP each` },
    { icon: MessageCircle, color: '#9b63e8', label: hi ? 'पूछे गए सवाल' : 'Questions asked', count: questions, xp: questions * XP_RULES.question, rule: hi ? `हर सवाल पर ${XP_RULES.question} XP` : `${XP_RULES.question} XP each` },
    { icon: Flame, color: '#dd6b20', label: hi ? 'दिन की स्ट्रीक' : 'Day streak', count: streak, xp: streak * XP_RULES.streakDay, rule: hi ? `हर दिन पर ${XP_RULES.streakDay} XP` : `${XP_RULES.streakDay} XP per day` },
  ];

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <ArrowLeft size={20} /> {hi ? 'वापस' : 'Back'}
      </button>

      <h1 className="h2" style={{ color: 'var(--primary-dark)', marginBottom: '32px' }}>
        {hi ? 'आपकी प्रगति' : 'Your Progress'}
      </h1>

      {/* CURRENT LEVEL */}
      <section style={styles.section}>
        <h2 className="h3" style={styles.h}>
          <TrendingUp color="var(--success)" size={24} />
          {hi ? `स्तर ${info.level}: ${name(info.name)}` : `Level ${info.level}: ${name(info.name)}`}
        </h2>
        <p style={styles.muted}>
          {info.next
            ? (hi ? `${info.xp} XP कमाए · ${name(info.next.name)} तक ${info.toNext} XP और` : `${info.xp} XP earned · ${info.toNext} XP to ${name(info.next.name)}`)
            : (hi ? `${info.xp} XP कमाए · आप सबसे ऊँचे स्तर पर हैं!` : `${info.xp} XP earned · you are at the top level!`)}
        </p>
        <div style={styles.bar} role="progressbar" aria-valuenow={info.percent} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ ...styles.barFill, width: `${info.percent}%` }} />
        </div>
      </section>

      {/* ALL LEVELS */}
      <section style={styles.section}>
        <h2 className="h3" style={styles.h}>{hi ? 'सभी स्तर' : 'All levels'}</h2>
        <ol style={styles.list}>
          {LEVELS.map((l, i) => {
            const state = i + 1 < info.level ? 'done' : i + 1 === info.level ? 'here' : 'locked';
            return (
              <li key={l.min} style={{ ...styles.row, ...(state === 'here' ? styles.rowHere : null), opacity: state === 'locked' ? 0.65 : 1 }}>
                <span style={{ ...styles.dot, background: state === 'locked' ? 'var(--border-color)' : 'var(--primary)' }}>
                  {state === 'done' ? <Check size={16} color="#fff" /> : state === 'locked' ? <Lock size={14} color="var(--text-muted)" /> : <span style={{ color: '#fff', fontWeight: 700 }}>{i + 1}</span>}
                </span>
                <span style={{ flex: 1 }}>
                  <strong>{hi ? 'स्तर' : 'Level'} {i + 1}: {name(l.name)}</strong>
                  <span style={styles.small}>{l.min} XP{state === 'here' ? (hi ? ' · आप यहाँ हैं' : ' · you are here') : ''}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* WHERE XP COMES FROM */}
      <section style={styles.section}>
        <h2 className="h3" style={styles.h}>{hi ? 'XP कैसे मिलता है' : 'How you earn XP'}</h2>
        <div style={styles.grid}>
          {sources.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={styles.tile}>
                <span style={{ ...styles.tileIcon, background: s.color }}><Icon size={20} color="#fff" /></span>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.count} {s.label}</div>
                  <div style={styles.small}>{s.rule} · <strong>+{s.xp} XP</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: 'none', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '32px' },
  section: { marginBottom: '32px', backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' },
  h: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  muted: { color: 'var(--text-muted)', marginBottom: '16px' },
  bar: { height: 14, borderRadius: 999, background: 'var(--bg-color)', border: '1px solid var(--border-color)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--primary), var(--accent, var(--primary-dark)))', transition: 'width .6s ease' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)' },
  rowHere: { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px color-mix(in srgb, var(--primary) 25%, transparent)' },
  dot: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' },
  small: { display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 },
  tile: { display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)' },
  tileIcon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' },
};

export default Progress;
