import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/languageContextValue';
import { useUserPhoto } from '../../utils/userPhoto';
import HomeExtras from './HomeExtras';
import ProgressRing from '../../components/ProgressRing';
import { Lock, Gamepad2, MessageCircle, BookOpen, Lightbulb, ChevronRight, ShieldCheck, Users, Landmark, FileText, Flame, TrendingUp, Activity, Stethoscope } from 'lucide-react';
import { getContinueLearningMeta, getStoredLearnProgress } from '../../utils/learningProgress';
import { recordDailyActivity, getDayStreakCount } from '../../utils/userProgress';
import { getLevelInfo } from '../../utils/levels';
import { accountsEnabled, useAuth } from '../../lib/auth';
import { lockedInfoFor } from '../../lib/guestAccess';

// Soft circles and a faint lotus behind the greeting. Purely decorative.
const BannerArt = () => (
  <div aria-hidden="true" style={styles.art}>
    <span style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', right: -70, top: -120 }} />
    <span style={{ position: 'absolute', width: 170, height: 170, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', left: '40%', bottom: -100 }} />
    <span style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', left: 30, bottom: -30 }} />
    <svg className="float-slow" viewBox="0 0 200 140" width="230" style={{ position: 'absolute', right: 120, bottom: -30, opacity: 0.28 }}>
      <g fill="#fff" fillOpacity="0.55" stroke="#fff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M100 110 C40 110, 10 70, 10 50 C30 70, 60 80, 100 110" />
        <path d="M100 110 C160 110, 190 70, 190 50 C170 70, 140 80, 100 110" />
        <path d="M100 110 C50 90, 20 40, 40 20 C60 40, 80 70, 100 110" />
        <path d="M100 110 C150 90, 180 40, 160 20 C140 40, 120 70, 100 110" />
        <path d="M100 110 C80 60, 80 20, 100 5 C120 20, 120 60, 100 110" />
      </g>
    </svg>
  </div>
);

// A vivid gradient card with a big faint icon as a watermark.
const Card = ({ title, icon, color, onClick, index, locked = false }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      className="hover-card action-card"
      onClick={onClick}
      style={{
        ...styles.card,
        background: `linear-gradient(135deg, color-mix(in srgb, ${color} 88%, #1a1030), color-mix(in srgb, ${color} 52%, #1a1030))`,
        '--i': index,
      }}
    >
      <span className="bubble" style={styles.bubble}><Icon color="#fff" size={22} /></span>
      <h3 style={styles.cardTitle}>{title}</h3>
      <Icon className="watermark" size={96} color="#fff" style={styles.watermark} aria-hidden="true" />
      {locked && <span style={styles.lockBadge} aria-label="Sign in needed"><Lock size={14} color="#fff" /></span>}
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const photo = useUserPhoto();
  const auth = useAuth();
  const isGuest = accountsEnabled && auth.status === 'signedOut';
  const [userName] = useState(() => localStorage.getItem('userName') || 'Didi');
  const [learnMeta, setLearnMeta] = useState(() => getContinueLearningMeta(getStoredLearnProgress()));
  const [dayStreak, setDayStreak] = useState(getDayStreakCount());
  const [levelInfo, setLevelInfo] = useState(() => getLevelInfo());

  useEffect(() => {
    const refreshLearningMeta = () => {
      setLearnMeta(getContinueLearningMeta(getStoredLearnProgress()));
      setDayStreak(recordDailyActivity());
      setLevelInfo(getLevelInfo()); // after the streak is recorded, so today's streak XP counts
    };

    refreshLearningMeta();
    window.addEventListener('storage', refreshLearningMeta);
    window.addEventListener('focus', refreshLearningMeta);
    window.addEventListener('naari-progress-synced', refreshLearningMeta);

    return () => {
      window.removeEventListener('storage', refreshLearningMeta);
      window.removeEventListener('focus', refreshLearningMeta);
      window.removeEventListener('naari-progress-synced', refreshLearningMeta);
    };
  }, []);

  const features = [
    { title: t("askAnything"), icon: MessageCircle, color: '#9b63e8', path: '/dashboard/ask' },
    { title: t("learn"), icon: BookOpen, color: '#1f9e8c', path: '/dashboard/learn' },
    { title: t("testKnowledge"), icon: ShieldCheck, color: '#dd6b20', path: '/dashboard/test' },
    { title: t("community"), icon: Users, color: '#3182ce', path: '/dashboard/community' },
    { title: t("schemes"), icon: Landmark, color: '#805ad5', path: '/dashboard/schemes' },
    { title: t("games"), icon: Gamepad2, color: '#e53e3e', path: '/dashboard/games' },
    { title: t("digitalDoctor"), icon: Stethoscope, color: '#2563eb', path: '/dashboard/digital-doctor' },
    { title: t("tracker"), icon: Activity, color: '#2c7a7b', path: '/dashboard/tracker' },
    { title: t("docScanner"), icon: FileText, color: '#d53f8c', path: '/dashboard/scanner' },
  ];

  const percent = learnMeta?.completionPercent || 0;

  return (
    <div className="fade-in">
      <header style={styles.header}>
        <BannerArt />
        <div style={styles.greeting}>
          <div style={styles.bannerAvatar}>
            {photo
              ? <img src={photo} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '1.6rem', fontWeight: '600', color: 'var(--primary)' }}>{userName.charAt(0).toUpperCase()}</span>}
          </div>
          <div>
            <h1 className="h2" style={styles.bannerTitle}>{t('namaste')} {userName}</h1>
            <p style={styles.bannerSub}>{t('welcome')}</p>
          </div>
        </div>
        <div style={styles.statsContainer}>
          <button
            onClick={() => navigate('/dashboard/progress')}
            style={styles.statBox}
            className="hover-card"
            title={lang === 'hi' ? 'कल भी आएं और अपनी स्ट्रीक बढ़ाएं' : 'Come back tomorrow to grow your streak'}
          >
            <Flame color="#dd6b20" size={20} />
            <span style={styles.statText}>{dayStreak} {lang === 'hi' ? 'दिन की स्ट्रीक' : 'Day Streak'}</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/progress')}
            style={styles.statBox}
            className="hover-card"
            title={levelInfo.next
              ? (lang === 'hi'
                ? `${levelInfo.xp} XP · ${levelInfo.next.name.hi} तक ${levelInfo.toNext} XP और`
                : `${levelInfo.xp} XP · ${levelInfo.toNext} XP to ${levelInfo.next.name.en}`)
              : `${levelInfo.xp} XP`}
          >
            <TrendingUp color="var(--success)" size={20} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              <span style={styles.statText}>
                {lang === 'hi' ? `स्तर ${levelInfo.level}: ${levelInfo.name.hi}` : `Lvl ${levelInfo.level}: ${levelInfo.name.en}`}
              </span>
              <span style={styles.levelTrack} aria-hidden="true">
                <span style={{ ...styles.levelFill, width: `${levelInfo.percent}%` }} />
              </span>
            </span>
          </button>
        </div>
      </header>

      <button type="button" onClick={() => navigate('/dashboard/daily-question')} style={styles.dailyBanner} className="hover-card">
        <span style={styles.bulb}><Lightbulb size={22} color="#b7791f" /></span>
        <span style={{ flex: 1, textAlign: 'left' }}>
          <strong style={styles.dailyTitle}>{t('aajKaSawaal')}</strong>
          <span style={styles.dailySub}>{lang === 'hi' ? 'आज का एक नया सवाल, अभी हल करें' : "Today's new question is waiting for you"}</span>
        </span>
        <ChevronRight size={22} color="#b7791f" />
      </button>

      <section style={styles.section}>
        <h2 className="h3" style={{marginBottom: '16px'}}>{t('quickActions')}</h2>
        <div style={styles.grid} className="stagger">
          {features.map((feat, i) => (
            <Card
              key={feat.title}
              index={i}
              title={feat.title}
              icon={feat.icon}
              color={feat.color}
              locked={isGuest && Boolean(lockedInfoFor(feat.path))}
              onClick={() => navigate(feat.path)}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 className="h3" style={{marginBottom: '16px'}}>{t('continueLearning')}</h2>
        <div style={styles.continueCard}>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <ProgressRing
              value={percent / 100}
              size={78}
              stroke={8}
              color="var(--primary)"
              track="var(--primary-light)"
              label={lang === 'hi' ? `${percent}% पूर्ण` : `${percent}% complete`}
            >
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{percent}%</strong>
            </ProgressRing>
            <div>
              <h4 style={{fontSize: '1.1rem', marginBottom: '4px'}}>{learnMeta?.module?.title || (lang === 'hi' ? 'सीखना जारी रखें' : 'Continue Learning')}</h4>
              <p className="subtext">
                {lang === 'hi'
                  ? `मॉड्यूल ${learnMeta.moduleNumber} • ${learnMeta.completionPercent}% पूर्ण`
                  : `Module ${learnMeta.moduleNumber} • ${learnMeta.completionPercent}% Completed`}
              </p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/dashboard/learn/${learnMeta.category}`)}>{t('resume')}</button>
        </div>
      </section>

      <HomeExtras />
    </div>
  );
};

const styles = {
  header: { position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', padding: '28px 32px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(120deg, #7a4bb7 0%, var(--primary) 45%, var(--secondary) 100%)', boxShadow: 'var(--shadow-lg)' },
  art: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' },
  greeting: { position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' },
  bannerAvatar: { width: '68px', height: '68px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, backgroundColor: '#fff', border: '3px solid rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.18)' },
  bannerTitle: { color: '#fff' },
  bannerSub: { color: 'rgba(255,255,255,0.92)', fontSize: '1rem', marginTop: '4px' },
  statsContainer: { position: 'relative', display: 'flex', gap: '16px', flexWrap: 'wrap' },
  statBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' },
  statText: { fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' },
  levelTrack: { display: 'block', width: '100%', minWidth: '88px', height: '5px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' },
  levelFill: { display: 'block', height: '100%', borderRadius: '999px', backgroundColor: 'var(--success)', transition: 'width 0.6s ease' },
  section: { marginBottom: '40px' },
  dailyBanner: { width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', marginBottom: '32px', backgroundColor: '#fffbeb', border: '1px solid #f6e05e', borderLeft: '5px solid #ecc94b', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', cursor: 'pointer' },
  bulb: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dailyTitle: { display: 'block', fontSize: '1.05rem', color: 'var(--text-dark)' },
  dailySub: { display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { position: 'relative', overflow: 'hidden', minHeight: '130px', padding: '20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', border: 'none', fontFamily: 'inherit', textAlign: 'left', color: '#fff', boxShadow: 'var(--shadow-md)' },
  bubble: { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.25s ease' },
  watermark: { position: 'absolute', right: '-14px', bottom: '-18px', opacity: 0.16, transform: 'rotate(-12deg)', pointerEvents: 'none', transition: 'transform 0.3s ease' },
  lockBadge: { position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { position: 'relative', fontSize: '1.08rem', fontWeight: '600', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.25)' },
  continueCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--border-color)', borderLeft: '5px solid var(--primary)' }
};

export default Home;
