import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Lock } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { TOPICS, GAME_TYPES, BADGES, LEVEL_COUNT, UI, getProgress, isUnlocked, levelSize, normaliseTopic } from '../../data/gamesData';
import Badge from './games/Badge';
import TopicModal from './games/TopicModal';

const sizeLabel = (ui, type, n) => (type === 'tf' ? ui.questions(n) : type === 'sort' ? ui.items(n) : ui.pairs(n));

const GameLevels = () => {
  const { type } = useParams();
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [changing, setChanging] = useState(false);

  if (!GAME_TYPES[type]) return <Navigate to="/dashboard/games" replace />;

  const ui = UI[lang];
  const game = GAME_TYPES[type];
  const topic = normaliseTopic(search.get('topic'));
  const progress = getProgress();

  return (
    <div className="fade-in">
      <div style={styles.top}>
        <button type="button" onClick={() => navigate('/dashboard/games')} style={styles.backBtn}>
          <ArrowLeft size={18} /> {ui.backToGames}
        </button>
        <button type="button" onClick={() => setChanging(true)} style={{ ...styles.topicBtn, color: TOPICS[topic].color, borderColor: TOPICS[topic].color }}>
          {ui.topic}: <strong>{TOPICS[topic].label[lang]}</strong> · {ui.changeTopic}
        </button>
      </div>

      <h1 className="h2" style={{ color: game.color, marginBottom: '20px' }}>{game.title[lang]}</h1>

      <div style={styles.grid}>
        {Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).map((level) => {
          const open = isUnlocked(progress, type, level);
          const stars = progress[type]?.[level] || 0;
          return (
            <button
              key={level}
              type="button"
              disabled={!open}
              onClick={() => navigate(`/dashboard/games/${type}/${level}?topic=${topic}`)}
              title={open ? undefined : ui.passToUnlock}
              className={open ? 'hover-card' : undefined}
              style={{ ...styles.level, backgroundColor: open ? game.bg : '#f1f5f9', opacity: open ? 1 : 0.7, cursor: open ? 'pointer' : 'not-allowed' }}
            >
              <Badge level={level} size={60} locked={!open} earned={stars > 0} />
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>{ui.level} {level}</strong>
              <span style={styles.badgeName}>
                {open ? BADGES[level - 1].name[lang] : (<><Lock size={12} /> {ui.locked}</>)}
              </span>
              <span style={styles.size}>{sizeLabel(ui, type, levelSize(type, level))}</span>
              <span style={{ display: 'flex', gap: '2px' }} aria-label={`${stars} ${ui.stars}`}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} size={15} color={n <= stars ? '#f6ad55' : '#cbd5e0'} fill={n <= stars ? '#f6ad55' : 'none'} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {changing && (
        <TopicModal
          gameTitle={game.title[lang]}
          current={topic}
          lang={lang}
          ui={ui}
          onSelect={(t) => { setSearch({ topic: t }, { replace: true }); setChanging(false); }}
          onClose={() => setChanging(false)}
        />
      )}
    </div>
  );
};

const styles = {
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dark)' },
  topicBtn: { padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '2px solid', backgroundColor: 'var(--surface)', fontFamily: 'inherit', fontSize: '0.95rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' },
  level: { padding: '18px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.05)', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  badgeName: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' },
  size: { fontSize: '0.8rem', color: 'var(--text-light)' },
};

export default GameLevels;
