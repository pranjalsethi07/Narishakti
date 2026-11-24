import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import {
  TOPICS, GAME_TYPES, LEVEL_COUNT, UI, buildLevel, levelSize, passMark,
  getProgress, saveLevel, isUnlocked, normaliseTopic,
} from '../../data/gamesData';
import MemoryMatch from './games/MemoryMatch';
import MatchPairs from './games/MatchPairs';
import TrueFalse from './games/TrueFalse';
import SortIt from './games/SortIt';
import GameResult from './games/GameResult';

// Plays one level. Remounted (via `key` below) whenever game, level or topic changes.
const LevelRunner = ({ type, level, topic }) => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = UI[lang];
  const { color, bg } = TOPICS[topic];
  const [data, setData] = useState(() => buildLevel(type, topic, level));
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);

  const toLevels = () => navigate(`/dashboard/games/${type}?topic=${topic}`);

  const handleFinish = (stars, detail, passed = true) => {
    if (passed) saveLevel(type, level, stars);
    setResult({ stars, detail, passed });
  };
  const playAgain = () => {
    setData(buildLevel(type, topic, level));
    setResult(null);
    setRound((r) => r + 1);
  };
  const nextLevel = () => navigate(`/dashboard/games/${type}/${level + 1}?topic=${topic}`);

  const common = { lang, ui, color, bg, onFinish: handleFinish };

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <button type="button" onClick={toLevels} style={styles.backBtn}>
          <ArrowLeft size={18} /> {ui.backToLevels}
        </button>
        <div>
          <h1 className="h3" style={{ color }}>{GAME_TYPES[type].title[lang]} · {ui.level} {level}</h1>
          <span className="subtext">{TOPICS[topic].label[lang]}</span>
        </div>
      </div>

      {result ? (
        <GameResult
          {...result}
          needed={passMark(levelSize(type, level))}
          level={level}
          lang={lang}
          ui={ui}
          color={color}
          hasNext={level < LEVEL_COUNT}
          onNext={nextLevel}
          onAgain={playAgain}
          onLevels={toLevels}
        />
      ) : (
        <>
          {type === 'memory' && <MemoryMatch key={round} pairs={data} {...common} />}
          {type === 'match' && <MatchPairs key={round} pairs={data} {...common} />}
          {type === 'tf' && <TrueFalse key={round} items={data} {...common} />}
          {type === 'sort' && <SortIt key={round} game={data} {...common} />}
        </>
      )}
    </div>
  );
};

const GamePlay = () => {
  const { type, level: levelParam } = useParams();
  const [search] = useSearchParams();
  const topic = normaliseTopic(search.get('topic'));
  const level = Number(levelParam);

  const valid = GAME_TYPES[type] && Number.isInteger(level) && level >= 1 && level <= LEVEL_COUNT;
  if (!valid) return <Navigate to="/dashboard/games" replace />;
  if (!isUnlocked(getProgress(), type, level)) {
    return <Navigate to={`/dashboard/games/${type}?topic=${topic}`} replace />;
  }

  return <LevelRunner key={`${type}-${level}-${topic}`} type={type} level={level} topic={topic} />;
};

const styles = {
  header: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dark)', cursor: 'pointer' },
};

export default GamePlay;
