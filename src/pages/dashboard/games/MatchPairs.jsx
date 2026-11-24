import { useState, useRef, useEffect } from 'react';
import { shuffle } from '../../../data/gamesData';

const starsFor = (mistakes) => (mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);

const MatchPairs = ({ pairs, lang, ui, color, bg, onFinish }) => {
  const [left] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, text: p.term }))));
  const [right] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, text: p.meaning }))));
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongRight, setWrongRight] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pickRight = (item) => {
    if (selected === null || matched.includes(item.id)) return;
    if (item.id === selected) {
      const next = [...matched, item.id];
      setMatched(next);
      setSelected(null);
      if (next.length === pairs.length) {
        onFinish(starsFor(mistakes), `${ui.mistakes}: ${mistakes}`);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongRight(item.id);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setWrongRight(null), 700);
    }
  };

  return (
    <div>
      <div style={styles.topRow}>
        <p className="subtext">{ui.matchHint}</p>
        <strong style={{ color }}>{ui.mistakes}: {mistakes}</strong>
      </div>
      <div style={styles.columns}>
        <div style={styles.column}>
          {left.map((item) => {
            const done = matched.includes(item.id);
            const isSel = selected === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={done}
                aria-pressed={isSel}
                onClick={() => setSelected(item.id)}
                style={{
                  ...styles.item,
                  backgroundColor: done ? '#e6f6ec' : isSel ? bg : 'var(--surface)',
                  borderColor: done ? 'var(--success)' : isSel ? color : 'var(--border-color)',
                  opacity: done ? 0.75 : 1,
                }}
              >
                {item.text[lang]}
              </button>
            );
          })}
        </div>
        <div style={styles.column}>
          {right.map((item) => {
            const done = matched.includes(item.id);
            const isWrong = wrongRight === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={done}
                onClick={() => pickRight(item)}
                style={{
                  ...styles.item,
                  backgroundColor: done ? '#e6f6ec' : isWrong ? '#fff0f0' : 'var(--surface)',
                  borderColor: done ? 'var(--success)' : isWrong ? 'var(--danger)' : 'var(--border-color)',
                  opacity: done ? 0.75 : 1,
                }}
              >
                {item.text[lang]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' },
  columns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
  column: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { padding: '16px', borderRadius: 'var(--radius-md)', border: '2px solid', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '500', textAlign: 'left', color: 'var(--text-dark)', lineHeight: 1.35 },
};

export default MatchPairs;
