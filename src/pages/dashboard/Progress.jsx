import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Flame, TrendingUp, ArrowLeft, Plus } from 'lucide-react';

const Progress = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [streaks, setStreaks] = useState([]);
  const [levels, setLevels] = useState([]);
  const [newStreakDays, setNewStreakDays] = useState('');
  const [newLevelNum, setNewLevelNum] = useState('');
  const [newLevelName, setNewLevelName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedStreaks = JSON.parse(localStorage.getItem('allStreaks') || '[]');
    const savedLevels = JSON.parse(localStorage.getItem('allLevels') || '[]');
    setStreaks(savedStreaks);
    setLevels(savedLevels);
  };

  const addStreak = () => {
    if (!newStreakDays.trim()) return;
    const newStreak = {
      id: Date.now(),
      days: newStreakDays,
      date: new Date().toLocaleDateString()
    };
    const updated = [...streaks, newStreak];
    setStreaks(updated);
    localStorage.setItem('allStreaks', JSON.stringify(updated));
    setNewStreakDays('');
  };

  const addLevel = () => {
    if (!newLevelNum.trim() || !newLevelName.trim()) return;
    const newLevel = {
      id: Date.now(),
      number: newLevelNum,
      name: newLevelName,
      date: new Date().toLocaleDateString()
    };
    const updated = [...levels, newLevel];
    setLevels(updated);
    localStorage.setItem('allLevels', JSON.stringify(updated));
    setNewLevelNum('');
    setNewLevelName('');
  };

  const deleteStreak = (id) => {
    const updated = streaks.filter(s => s.id !== id);
    setStreaks(updated);
    localStorage.setItem('allStreaks', JSON.stringify(updated));
  };

  const deleteLevel = (id) => {
    const updated = levels.filter(l => l.id !== id);
    setLevels(updated);
    localStorage.setItem('allLevels', JSON.stringify(updated));
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <ArrowLeft size={20} /> {lang === 'hi' ? 'वापस' : 'Back'}
      </button>

      <h1 className="h2" style={{ color: 'var(--primary-dark)', marginBottom: '32px' }}>
        {lang === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
      </h1>

      {/* STREAKS SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame color="#dd6b20" size={24} />
            {lang === 'hi' ? 'स्ट्रीक्स' : 'Streaks'}
          </h2>
        </div>

        <div style={styles.addForm}>
          <input
            type="number"
            placeholder={lang === 'hi' ? 'दिन दर्ज करें' : 'Enter days'}
            value={newStreakDays}
            onChange={(e) => setNewStreakDays(e.target.value)}
            style={styles.input}
          />
          <button onClick={addStreak} style={styles.addBtn}>
            <Plus size={16} /> {lang === 'hi' ? 'जोड़ें' : 'Add'}
          </button>
        </div>

        <div style={styles.recordsContainer}>
          {streaks.length === 0 ? (
            <p style={styles.emptyText}>{lang === 'hi' ? 'कोई स्ट्रीक सहेजा नहीं गया' : 'No streaks saved yet'}</p>
          ) : (
            streaks.map((streak) => (
              <div key={streak.id} style={styles.recordCard}>
                <div style={styles.recordContent}>
                  <h4 style={styles.recordTitle}>{streak.days} {lang === 'hi' ? 'दिन' : 'Days'}</h4>
                  <p style={styles.recordDate}>{streak.date}</p>
                </div>
                <button onClick={() => deleteStreak(streak.id)} style={styles.deleteBtn}>✕</button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* LEVELS SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp color="var(--success)" size={24} />
            {lang === 'hi' ? 'स्तर' : 'Levels'}
          </h2>
        </div>

        <div style={styles.addForm}>
          <input
            type="number"
            placeholder={lang === 'hi' ? 'स्तर संख्या' : 'Level number'}
            value={newLevelNum}
            onChange={(e) => setNewLevelNum(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'स्तर का नाम' : 'Level name'}
            value={newLevelName}
            onChange={(e) => setNewLevelName(e.target.value)}
            style={styles.input}
          />
          <button onClick={addLevel} style={styles.addBtn}>
            <Plus size={16} /> {lang === 'hi' ? 'जोड़ें' : 'Add'}
          </button>
        </div>

        <div style={styles.recordsContainer}>
          {levels.length === 0 ? (
            <p style={styles.emptyText}>{lang === 'hi' ? 'कोई स्तर सहेजा नहीं गया' : 'No levels saved yet'}</p>
          ) : (
            levels.map((level) => (
              <div key={level.id} style={styles.recordCard}>
                <div style={styles.recordContent}>
                  <h4 style={styles.recordTitle}>{lang === 'hi' ? 'स्तर' : 'Lvl'} {level.number}: {level.name}</h4>
                  <p style={styles.recordDate}>{level.date}</p>
                </div>
                <button onClick={() => deleteLevel(level.id)} style={styles.deleteBtn}>✕</button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '32px' },
  section: { marginBottom: '40px', backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' },
  sectionHeader: { marginBottom: '24px' },
  addForm: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  input: { flex: '1 1 200px', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', backgroundColor: 'var(--bg-color)' },
  addBtn: { padding: '12px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
  recordsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  recordCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' },
  recordContent: { flex: 1 },
  recordTitle: { fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' },
  recordDate: { fontSize: '0.9rem', color: 'var(--text-muted)' },
  deleteBtn: { padding: '8px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: 'var(--text-muted)', padding: '32px 16px', fontSize: '1.1rem' }
};

export default Progress;
