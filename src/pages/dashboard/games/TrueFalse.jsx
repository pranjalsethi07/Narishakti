import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { shuffle } from '../../../data/gamesData';

import { passMark } from '../../../data/gamesData';

const starsFor = (correct, total) => (correct >= total - 1 ? 3 : correct >= passMark(total) ? 2 : 1);

const TrueFalse = ({ items, lang, ui, color, bg, onFinish }) => {
  const [order] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);

  const q = order[index];
  const answered = picked !== null;
  const isRight = answered && picked === q.answer;

  const answer = (value) => {
    if (answered) return;
    setPicked(value);
    if (value === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (index + 1 === order.length) {
      onFinish(starsFor(correct, order.length), `${ui.score}: ${correct}/${order.length}`, correct >= passMark(order.length));
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  const optionStyle = (value) => {
    const base = { ...styles.option };
    if (!answered) return base;
    if (value === q.answer) return { ...base, backgroundColor: '#e6f6ec', borderColor: 'var(--success)' };
    if (value === picked) return { ...base, backgroundColor: '#fff0f0', borderColor: 'var(--danger)' };
    return { ...base, opacity: 0.55 };
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={styles.topRow}>
        <span className="subtext">{ui.question} {index + 1}/{order.length}</span>
        <strong style={{ color }}>{ui.score}: {correct}</strong>
      </div>
      <div style={styles.track} aria-hidden="true">
        <div style={{ ...styles.fill, width: `${(index / order.length) * 100}%`, backgroundColor: color }} />
      </div>

      <div style={{ ...styles.statement, backgroundColor: bg }}>
        <h2 className="h3" style={{ lineHeight: 1.4 }}>{q.text[lang]}</h2>
      </div>

      <div style={styles.options}>
        <button type="button" style={optionStyle(true)} onClick={() => answer(true)}>{ui.trueLabel}</button>
        <button type="button" style={optionStyle(false)} onClick={() => answer(false)}>{ui.falseLabel}</button>
      </div>

      {answered && (
        <div style={styles.feedback} role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isRight ? 'var(--success)' : 'var(--danger)', fontWeight: '700' }}>
            {isRight ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {isRight ? ui.right : ui.wrong}
          </div>
          <p style={{ marginTop: '8px', color: 'var(--text-dark)' }}>{q.why[lang]}</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: '16px' }} onClick={next}>
            {index + 1 === order.length ? ui.seeResult : ui.next}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  track: { height: '8px', borderRadius: '999px', backgroundColor: 'var(--border-color)', overflow: 'hidden', marginBottom: '24px' },
  fill: { height: '100%', borderRadius: '999px', transition: 'width 0.3s ease' },
  statement: { padding: '32px 28px', borderRadius: 'var(--radius-lg)', marginBottom: '20px', minHeight: '120px', display: 'flex', alignItems: 'center' },
  options: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  option: { padding: '18px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', backgroundColor: 'var(--surface)', fontFamily: 'inherit', fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-dark)' },
  feedback: { marginTop: '20px', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)' },
};

export default TrueFalse;
