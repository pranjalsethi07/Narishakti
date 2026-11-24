import { useState, useRef, useEffect } from 'react';
import { shuffle } from '../../../data/gamesData';

const buildDeck = (pairs) =>
  shuffle(
    pairs.flatMap((p, i) => [
      { id: `t${i}`, pairId: i, text: p.term },
      { id: `m${i}`, pairId: i, text: p.meaning },
    ])
  );

const starsFor = (moves, pairCount) => (moves <= pairCount + 3 ? 3 : moves <= pairCount * 2 ? 2 : 1);

const MemoryMatch = ({ pairs, lang, ui, color, bg, onFinish }) => {
  const [deck] = useState(() => buildDeck(pairs));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flip = (card) => {
    if (locked || flipped.includes(card.id) || matched.includes(card.pairId)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length < 2) return;

    const newMoves = moves + 1;
    setMoves(newMoves);
    setLocked(true);
    const [a, b] = next.map((id) => deck.find((c) => c.id === id));
    const isMatch = a.pairId === b.pairId;

    timer.current = setTimeout(() => {
      if (isMatch) {
        const nextMatched = [...matched, a.pairId];
        setMatched(nextMatched);
        if (nextMatched.length === pairs.length) {
          onFinish(starsFor(newMoves, pairs.length), `${ui.moves}: ${newMoves}`);
        }
      }
      setFlipped([]);
      setLocked(false);
    }, isMatch ? 450 : 900);
  };

  return (
    <div>
      <div style={styles.topRow}>
        <p className="subtext">{ui.memoryHint}</p>
        <strong style={{ color }}>{ui.moves}: {moves}</strong>
      </div>
      <div style={styles.grid}>
        {deck.map((card) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.pairId);
          const isDone = matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              aria-label={isOpen ? card.text[lang] : '?'}
              style={{
                ...styles.card,
                backgroundColor: isOpen ? bg : color,
                color: isOpen ? 'var(--text-dark)' : '#fff',
                borderColor: isDone ? 'var(--success)' : color,
                boxShadow: isDone ? '0 0 0 2px var(--success)' : 'var(--shadow-sm)',
                cursor: isOpen ? 'default' : 'pointer',
              }}
            >
              {isOpen ? card.text[lang] : '?'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px' },
  card: { minHeight: '104px', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '600', lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'background-color 0.2s' },
};

export default MemoryMatch;
