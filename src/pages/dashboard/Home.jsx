import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MessageCircle, BookOpen, Target, ShieldCheck, Users, Landmark, FileText, Flame, TrendingUp, Activity, Stethoscope } from 'lucide-react';
import { getContinueLearningMeta, getStoredLearnProgress } from '../../utils/learningProgress';
import { recordDailyActivity, getDayStreakCount } from '../../utils/userProgress';

const Card = ({ title, icon: Icon, color, bg, onClick }) => (
  <div style={{...styles.card, backgroundColor: bg}} className="hover-card" onClick={onClick}>
    <div style={{...styles.iconWrapper, backgroundColor: color}}>
      <Icon color="#fff" size={24} />
    </div>
    <h3 style={styles.cardTitle}>{title}</h3>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [userName, setUserName] = useState('');
  const [learnMeta, setLearnMeta] = useState(() => getContinueLearningMeta(getStoredLearnProgress()));
  const [dayStreak, setDayStreak] = useState(getDayStreakCount());

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Didi';
    setUserName(name);

    const refreshLearningMeta = () => {
      setLearnMeta(getContinueLearningMeta(getStoredLearnProgress()));
      setDayStreak(recordDailyActivity());
    };

    refreshLearningMeta();
    window.addEventListener('storage', refreshLearningMeta);
    window.addEventListener('focus', refreshLearningMeta);

    return () => {
      window.removeEventListener('storage', refreshLearningMeta);
      window.removeEventListener('focus', refreshLearningMeta);
    };
  }, []);

  const features = [
    { title: t("askAnything"), icon: MessageCircle, color: 'var(--primary)', bg: 'var(--primary-light)', path: '/dashboard/ask' },
    { title: t("learn"), icon: BookOpen, color: 'var(--accent)', bg: 'var(--accent-light)', path: '/dashboard/learn' },
    { title: t("aajKaSawaal"), icon: Target, color: 'var(--secondary)', bg: 'var(--secondary-light)', path: '/dashboard/daily-question' },
    { title: t("testKnowledge"), icon: ShieldCheck, color: '#f6ad55', bg: '#feebc8', path: '/dashboard/test' },
    { title: t("community"), icon: Users, color: '#4299e1', bg: '#ebf8ff', path: '/dashboard/community' },
    { title: t("schemes"), icon: Landmark, color: '#805ad5', bg: '#faf5ff', path: '/dashboard/schemes' },
    { title: t("digitalDoctor"), icon: Stethoscope, color: '#2563eb', bg: '#eff6ff', path: '/dashboard/digital-doctor' },
    { title: t("tracker"), icon: Activity, color: '#2c7a7b', bg: '#e6fffa', path: '/dashboard/tracker' },
    { title: t("docScanner"), icon: FileText, color: '#d53f8c', bg: '#fff5f7', path: '/dashboard/scanner' },
  ];

  return (
    <div className="fade-in">
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{color: 'var(--primary-dark)'}}>{t('namaste')} {userName} 👋</h1>
          <p className="subtext">{t('welcome')}</p>
        </div>
        <div style={styles.statsContainer}>
          <button onClick={() => navigate('/dashboard/progress')} style={styles.statBox} className="hover-card">
            <Flame color="#dd6b20" size={20} />
            <span style={styles.statText}>{dayStreak} {lang === 'hi' ? 'दिन की स्ट्रीक' : 'Day Streak'}</span>
          </button>
          <button onClick={() => navigate('/dashboard/progress')} style={styles.statBox} className="hover-card">
            <TrendingUp color="var(--success)" size={20} />
            <span style={styles.statText}>{lang === 'hi' ? 'स्तर 2: शिक्षार्थी' : 'Lvl 2: Learner'}</span>
          </button>
        </div>
      </header>

      <section style={styles.section}>
        <h2 className="h3" style={{marginBottom: '16px'}}>{t('quickActions')}</h2>
        <div style={styles.grid}>
          {features.map((feat) => (
            <Card 
              key={feat.title} 
              title={feat.title} 
              icon={feat.icon} 
              color={feat.color} 
              bg={feat.bg} 
              onClick={() => navigate(feat.path)}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 className="h3" style={{marginBottom: '16px'}}>{t('continueLearning')}</h2>
        <div style={styles.continueCard}>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <div style={{width: '60px', height: '60px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Landmark color="var(--primary)" size={32} />
            </div>
            <div>
              <h4 style={{fontSize: '1.1rem', marginBottom: '4px'}}>{learnMeta?.module?.title || (lang === 'hi' ? 'सीखना जारी रखें' : 'Continue Learning')}</h4>
              <p className="subtext">
                {lang === 'hi'
                  ? `मॉड्यूल ${learnMeta.moduleNumber} • ${learnMeta.completionPercent}% पूर्ण`
                  : `Module ${learnMeta.moduleNumber} • ${learnMeta.completionPercent}% Completed`}
              </p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/learn')}>{t('resume')}</button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  statsContainer: { display: 'flex', gap: '16px' },
  statBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' },
  statText: { fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' },
  section: { marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { padding: '20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', border: '1px solid rgba(0,0,0,0.02)' },
  iconWrapper: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' },
  cardTitle: { fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-dark)' },
  continueCard: { backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }
};

export default Home;
