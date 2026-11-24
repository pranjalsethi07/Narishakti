import { useState, useRef, useEffect } from 'react';
import { shuffle } from '../../../data/gamesData';

const starsFor = (mistakes) => (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);

const SortIt = ({ game, lang, ui, color, bg, onFinish }) => {
  const [pool, setPool] = useState(() => shuffle(game.items.map((it, i) => ({ ...it, id: i }))));
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState([[], []]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const drop = (bucket) => {
    if (selected === null) return;
    const item = pool.find((p) => p.id === selected);
    if (!item) return;

    if (item.bucket === bucket) {
      const nextPool = pool.filter((p) => p.id !== item.id);
      setPool(nextPool);
      setPlaced((prev) => prev.map((list, i) => (i === bucket ? [...list, item] : list)));
      setSelected(null);
      if (nextPool.length === 0) {
        onFinish(starsFor(mistakes), `${ui.mistakes}: ${mistakes}`);
      }
    } else {
      setMistakes((m) => m + 1);
      setShake(bucket);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShake(null), 600);
    }
  };

  return (
    <div>
      <div style={styles.topRow}>
        <p className="subtext">{ui.sortHint}</p>
        <strong style={{ color }}>{ui.mistakes}: {mistakes}</strong>
      </div>

      <div style={styles.pool} aria-live="polite">
        {pool.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
            style={{
              ...styles.chip,
              backgroundColor: selected === item.id ? color : 'var(--surface)',
              color: selected === item.id ? '#fff' : 'var(--text-dark)',
              borderColor: selected === item.id ? color : 'var(--border-color)',
            }}
          >
            {item.text[lang]}
          </button>
        ))}
      </div>

      <div style={styles.buckets}>
        {game.buckets.map((label, b) => (
          <button
            key={b}
            type="button"
            onClick={() => drop(b)}
            style={{
              ...styles.bucket,
              backgroundColor: bg,
              borderColor: shake === b ? 'var(--danger)' : color,
              boxShadow: shake === b ? '0 0 0 3px rgba(229,62,62,0.25)' : 'none',
              cursor: selected === null ? 'default' : 'pointer',
            }}
          >
            <h3 className="h3" style={{ color, marginBottom: '12px' }}>{label[lang]}</h3>
            <div style={styles.placed}>
              {placed[b].map((item) => (
                <span key={item.id} style={styles.placedChip}>{item.text[lang]}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' },
  pool: { display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '56px', marginBottom: '24px' },
  chip: { padding: '10px 16px', borderRadius: '999px', border: '2px solid', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '500' },
  buckets: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
  bucket: { minHeight: '220px', padding: '20px', borderRadius: 'var(--radius-lg)', border: '2px dashed', fontFamily: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'box-shadow 0.2s, border-color 0.2s' },
  placed: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  placedChip: { padding: '6px 12px', borderRadius: '999px', backgroundColor: 'var(--surface)', border: '1px solid var(--success)', color: 'var(--text-dark)', fontSize: '0.9rem' },
};

export default SortIt;
