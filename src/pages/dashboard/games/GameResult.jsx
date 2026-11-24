import { Star, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { BADGES } from '../../../data/gamesData';
import Badge from './Badge';

const GameResult = ({ stars, passed, detail, needed, level, lang, ui, color, hasNext, onNext, onAgain, onLevels }) => (
  <div style={styles.wrap} className="fade-in" role="status">
    {passed ? (
      <>
        <div className="pop-in" style={{ display: 'flex', justifyContent: 'center' }}>
          <Badge level={level} size={104} />
        </div>
        <p style={{ marginTop: '14px', fontWeight: '700', color }}>{ui.badgeEarned}: {BADGES[level - 1].name[lang]}</p>
        <h2 className="h2" style={{ marginTop: '4px' }}>{ui.levelCleared(level)}</h2>
        <div style={styles.stars} aria-label={`${stars} ${ui.stars}`}>
          {[1, 2, 3].map((n) => (
            <Star key={n} size={32} color={n <= stars ? '#f6ad55' : 'var(--border-color)'} fill={n <= stars ? '#f6ad55' : 'none'} />
          ))}
        </div>
        <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>{ui.resultTitle[stars]}</p>
        {!hasNext && <p style={{ marginTop: '12px', fontWeight: '600', color: 'var(--success)' }}>{ui.allDone}</p>}
      </>
    ) : (
      <>
        <h2 className="h2" style={{ color }}>{ui.failTitle}</h2>
        <p style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '1.05rem' }}>{ui.needToPass(needed)}</p>
      </>
    )}

    <p style={{ marginTop: '14px', fontWeight: '600' }}>{detail}</p>

    <div style={styles.actions}>
      {passed && hasNext && (
        <button type="button" className="btn btn-primary" onClick={onNext}>
          {ui.nextLevel} <ArrowRight size={18} />
        </button>
      )}
      <button type="button" className={passed && hasNext ? 'btn btn-secondary' : 'btn btn-primary'} onClick={onAgain}>
        <RotateCcw size={18} /> {ui.playAgain}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onLevels}>
        <ArrowLeft size={18} /> {ui.backToLevels}
      </button>
    </div>
  </div>
);

const styles = {
  wrap: { maxWidth: '520px', margin: '24px auto', padding: '36px 24px', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' },
  stars: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' },
  actions: { display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '28px' },
};

export default GameResult;
