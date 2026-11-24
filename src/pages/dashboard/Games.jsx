import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Puzzle, HelpCircle, ArrowLeftRight, Award } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { GAME_TYPES, GAME_KEYS, LEVEL_COUNT, UI, getProgress, completedCount, totalBadges } from '../../data/gamesData';
import TopicModal from './games/TopicModal';

const ICONS = { memory: Brain, match: Puzzle, tf: HelpCircle, sort: ArrowLeftRight };

const Games = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = UI[lang];
  const [progress] = useState(getProgress);
  const [picking, setPicking] = useState(null); // game type whose topic popup is open

  const choose = (topic) => {
    const type = picking;
    setPicking(null);
    navigate(`/dashboard/games/${type}?topic=${topic}`);
  };

  return (
    <div className="fade-in">
      <header style={styles.header}>
        <div>
          <h1 className="h2" style={{ color: 'var(--primary-dark)' }}>{ui.title}</h1>
          <p className="subtext">{ui.subtitle}</p>
        </div>
        <div style={styles.badgeCount}>
          <Award size={20} color="#d69e2e" />
          <span>{ui.badgesEarned}: <strong>{totalBadges(progress)}/{GAME_KEYS.length * LEVEL_COUNT}</strong></span>
        </div>
      </header>

      <div style={styles.grid}>
        {GAME_KEYS.map((type) => {
          const game = GAME_TYPES[type];
          const Icon = ICONS[type];
          const done = completedCount(progress, type);
          return (
            <button
              key={type}
              type="button"
              className="hover-card"
              onClick={() => setPicking(type)}
              style={{ ...styles.card, backgroundColor: game.bg }}
            >
              <div style={{ ...styles.iconWrap, backgroundColor: game.color }}>
                <Icon color="#fff" size={26} />
              </div>
              <h3 style={styles.cardTitle}>{game.title[lang]}</h3>
              <p style={styles.cardDesc}>{game.desc[lang]}</p>
              <div style={{ width: '100%' }}>
                <div style={styles.track} aria-hidden="true">
                  <div style={{ ...styles.fill, width: `${(done / LEVEL_COUNT) * 100}%`, backgroundColor: game.color }} />
                </div>
                <div style={styles.cardFoot}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ui.levelsDone(done)}</span>
                  <span style={{ color: game.color, fontWeight: '700' }}>{ui.play}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {picking && (
        <TopicModal
          gameTitle={GAME_TYPES[picking].title[lang]}
          lang={lang}
          ui={ui}
          onSelect={choose}
          onClose={() => setPicking(null)}
        />
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' },
  badgeCount: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.04)', fontFamily: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' },
  iconWrap: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-dark)' },
  cardDesc: { color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.45, flex: 1 },
  track: { height: '6px', borderRadius: '999px', backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '8px' },
  fill: { height: '100%', borderRadius: '999px' },
  cardFoot: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

export default Games;
