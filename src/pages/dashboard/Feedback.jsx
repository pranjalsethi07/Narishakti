import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Send, Trash2, Check, CloudOff } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { accountsEnabled, useAuth } from '../../lib/auth';
import { COURSES } from '../../data/courses';
import { CATEGORIES, MAX_LENGTH, addFeedback, loadFeedback, pullRemoteFeedback, pushPendingFeedback, removeFeedback } from '../../lib/feedback';

const TEXT = {
  en: {
    back: 'Back', title: 'Share your feedback', sub: 'Tell us what is working and what is not. It helps us make NariShakti better for every woman.',
    rating: 'How is your experience?', ratingWords: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
    topic: 'What is it about?', cats: { idea: 'An idea', problem: 'A problem', content: 'Lesson content', praise: 'Something I liked', other: 'Something else', lesson: 'Lesson feedback' },
    message: 'Your message', placeholder: 'Write here. Please do not include your phone number, address or other private details.',
    send: 'Send feedback', sending: 'Sending...', needRating: 'Please choose a star rating.', needMessage: 'Please write a message.',
    thanks: 'Thank you! Your feedback was saved.', savedAccount: 'Saved to your account.', savedDevice: 'Saved on this device. Sign in to back it up to your account.', savedOffline: 'Saved on this device. It will upload when you are online.',
    mine: 'Your earlier feedback', none: 'You have not sent any feedback yet.', remove: 'Delete', sentTag: 'In your account', deviceTag: 'This device only',
    anon: 'Your feedback is linked to your account, not your name.',
  },
  hi: {
    back: 'वापस', title: 'अपनी राय दें', sub: 'बताइए क्या अच्छा चल रहा है और क्या नहीं। इससे हम नारीशक्ति को हर महिला के लिए बेहतर बना पाते हैं।',
    rating: 'आपका अनुभव कैसा रहा?', ratingWords: ['खराब', 'ठीक-ठाक', 'अच्छा', 'बहुत अच्छा', 'शानदार'],
    topic: 'यह किस बारे में है?', cats: { idea: 'कोई सुझाव', problem: 'कोई समस्या', content: 'पाठों की सामग्री', praise: 'कुछ पसंद आया', other: 'कुछ और', lesson: 'पाठ की राय' },
    message: 'आपका संदेश', placeholder: 'यहाँ लिखें। कृपया अपना फ़ोन नंबर, पता या दूसरी निजी जानकारी न लिखें।',
    send: 'राय भेजें', sending: 'भेज रहे हैं...', needRating: 'कृपया स्टार रेटिंग चुनें।', needMessage: 'कृपया संदेश लिखें।',
    thanks: 'धन्यवाद! आपकी राय सहेज ली गई।', savedAccount: 'आपके अकाउंट में सहेजी गई।', savedDevice: 'इस डिवाइस पर सहेजी गई। अकाउंट में बैकअप के लिए साइन इन करें।', savedOffline: 'इस डिवाइस पर सहेजी गई। ऑनलाइन होने पर अपलोड हो जाएगी।',
    mine: 'आपकी पहले दी गई राय', none: 'आपने अभी तक कोई राय नहीं भेजी है।', remove: 'हटाएँ', sentTag: 'आपके अकाउंट में', deviceTag: 'सिर्फ़ इस डिवाइस पर',
    anon: 'आपकी राय आपके अकाउंट से जुड़ी है, आपके नाम से नहीं।',
  },
};

const Stars = ({ value, onChange, label }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'flex', gap: 6 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 0 }}
        >
          <Star size={34} color="#e8a317" fill={n <= shown ? '#e8a317' : 'none'} />
        </button>
      ))}
    </div>
  );
};

const Feedback = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const tx = TEXT[lang === 'hi' ? 'hi' : 'en'];
  const auth = useAuth();
  const isGuest = accountsEnabled && auth.status === 'signedOut';

  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('idea');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState(() => loadFeedback());

  // Upload anything waiting and bring in feedback sent from another device.
  useEffect(() => {
    let live = true;
    (async () => {
      await pushPendingFeedback().catch(() => {});
      await pullRemoteFeedback().catch(() => {});
      if (live) setItems(loadFeedback());
    })();
    return () => { live = false; };
  }, [auth.status]);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) { setError(tx.needRating); return; }
    if (!message.trim()) { setError(tx.needMessage); return; }
    setError('');
    setBusy(true);
    try {
      const saved = await addFeedback({ rating, category, message });
      setNote(`${tx.thanks} ${saved.sent ? tx.savedAccount : (isGuest || !accountsEnabled ? tx.savedDevice : tx.savedOffline)}`);
      setRating(0);
      setMessage('');
      setItems(loadFeedback());
    } catch {
      setError(tx.needMessage);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    await removeFeedback(id);
    setItems(loadFeedback());
  };

  const lessonName = (f) => {
    const l = COURSES[f.course]?.lessons.find((x) => String(x.id) === String(f.lessonId));
    return l ? (lang === 'hi' ? l.title.hi : l.title.en) : '';
  };
  const date = (iso) => new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <ArrowLeft size={20} /> {tx.back}
      </button>

      <h1 className="h2" style={{ color: 'var(--primary-dark)', marginBottom: 8 }}>{tx.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28, maxWidth: '62ch' }}>{tx.sub}</p>

      <form onSubmit={submit} style={styles.card} noValidate>
        <div style={styles.field}>
          <span style={styles.label} id="fb-rating">{tx.rating}</span>
          <Stars value={rating} onChange={setRating} label={tx.rating} />
          <span style={{ minHeight: 22, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{rating ? tx.ratingWords[rating - 1] : ''}</span>
        </div>

        <div style={styles.field}>
          <span style={styles.label}>{tx.topic}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="radiogroup" aria-label={tx.topic}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={category === c}
                onClick={() => setCategory(c)}
                style={{ ...styles.chip, ...(category === c ? styles.chipOn : null) }}
              >
                {tx.cats[c]}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label htmlFor="fb-message" style={styles.label}>{tx.message}</label>
          <textarea
            id="fb-message"
            value={message}
            maxLength={MAX_LENGTH}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={tx.placeholder}
            rows={6}
            style={styles.textarea}
          />
          <span style={{ alignSelf: 'flex-end', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message.length}/{MAX_LENGTH}</span>
        </div>

        {error && <p role="alert" style={{ color: '#c53030', fontWeight: 600 }}>{error}</p>}
        {note && <p role="status" style={{ color: 'var(--success, #2f855a)', fontWeight: 600 }}>{note}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button type="submit" disabled={busy} style={{ ...styles.send, opacity: busy ? 0.7 : 1 }}>
            <Send size={18} /> {busy ? tx.sending : tx.send}
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tx.anon}</span>
        </div>
      </form>

      <h2 className="h3" style={{ margin: '36px 0 14px' }}>{tx.mine}</h2>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{tx.none}</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((f) => (
            <li key={f.id} style={styles.item}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span aria-label={`${f.rating}/5`} style={{ display: 'inline-flex' }}>
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} color="#e8a317" fill={n <= f.rating ? '#e8a317' : 'none'} />)}
                  </span>
                  <strong>{tx.cats[f.category]}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{date(f.createdAt)}</span>
                  <span style={{ ...styles.tag, ...(f.sent ? styles.tagOk : null) }}>
                    {f.sent ? <Check size={12} /> : <CloudOff size={12} />} {f.sent ? tx.sentTag : tx.deviceTag}
                  </span>
                </div>
                {f.category === 'lesson' && <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{lessonName(f)}</p>}
                {f.message && <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{f.message}</p>}
              </div>
              <button type="button" onClick={() => remove(f.id)} aria-label={tx.remove} title={tx.remove} style={styles.del}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: 820, margin: '0 auto' },
  backBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: 28 },
  card: { display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--surface)', padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontWeight: 700, color: 'var(--text-dark)' },
  chip: { padding: '9px 16px', borderRadius: 999, border: '1px solid var(--border-color)', background: 'var(--bg-color)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem', color: 'var(--text-dark)' },
  chipOn: { background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff', fontWeight: 600 },
  textarea: { width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', fontFamily: 'inherit', background: 'var(--bg-color)', resize: 'vertical', minHeight: 130 },
  send: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  item: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: 18, background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' },
  tag: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', padding: '3px 9px', borderRadius: 999, background: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' },
  tagOk: { color: '#2f855a', borderColor: '#9ae6b4', background: '#f0fff4' },
  del: { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 'var(--radius-md)', padding: 10, cursor: 'pointer', lineHeight: 0 },
};

export default Feedback;
