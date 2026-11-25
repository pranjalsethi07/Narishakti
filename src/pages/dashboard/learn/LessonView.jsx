import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenText, Check, Clapperboard, Coins, ExternalLink, ListChecks, RotateCcw, Sparkles, Star, Trophy } from 'lucide-react';
import { useLanguage } from '../../../context/languageContextValue';
import { stepsOf } from '../../../data/courses';
import { LESSON_CATEGORY, addFeedback, hasLessonFeedback } from '../../../lib/feedback';

const STEP_META = {
  watch: { icon: Clapperboard, en: 'Watch', hi: 'देखें' },
  read: { icon: BookOpenText, en: 'Read', hi: 'पढ़ें' },
  quiz: { icon: ListChecks, en: 'Quiz', hi: 'क्विज़' },
};
const WATCH_TO_FINISH = 0.9; // share of the video that must be played before the next step opens

// One lesson, step by step: Watch (if it has a video) → Read → Quiz. A step opens once the one before
// is done; a finished lesson (or "Open all lessons") lets the learner move freely between steps.
const LessonView = ({ course, lesson, lessonNo, doneSteps, finished, celebrate, onReview, openAll, onStepDone, onLessonDone, next, coins = 0 }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const L = (o) => o?.[lang] ?? o?.en;
  const steps = stepsOf(lesson);
  const firstOpen = steps.findIndex((s) => !doneSteps.includes(s));
  const [stepIdx, setStepIdx] = useState(finished || firstOpen < 0 ? 0 : firstOpen);
  const step = steps[stepIdx];

  const canOpen = (i) => finished || openAll || i === 0 || doneSteps.includes(steps[i - 1]);
  const advance = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));

  if (celebrate) {
    return (
      <div className="lx-done fade-in">
        <div className="lx-trophy"><Trophy size={44} color="#d69e2e" /></div>
        <h2 style={{ fontSize: '1.6rem' }}>{tr('Lesson complete!', 'पाठ पूरा हुआ!')}</h2>
        <p className="subtext" style={{ marginTop: 6 }}>{tr(`You finished Lesson ${lessonNo}: ${lesson.title.en}`, `आपने पाठ ${lessonNo} पूरा किया: ${lesson.title.hi}`)}</p>
        {coins > 0 ? (
          <>
            <div className="lx-coins" data-coin-source><Coins size={18} /> {tr(`+${coins} coins`, `+${coins} सिक्के`)}</div>
            <p className="subtext" style={{ marginTop: 8, fontSize: '.9rem' }}>
              {tr('Added to your ', 'आपके ')}<Link to="/dashboard/coins" style={{ fontWeight: 700 }}>{tr('Coin Bag', 'कॉइन बैग')}</Link>{tr('.', ' में जुड़ गए।')}
            </p>
          </>
        ) : (
          <p className="subtext" style={{ marginTop: 14, fontSize: '.9rem' }}>{tr('You already earned the coins for this lesson.', 'इस पाठ के सिक्के आप पहले ही कमा चुकी हैं।')}</p>
        )}
        <LessonFeedback courseId={course.id} lessonId={lesson.id} />
        <div className="lx-nav" style={{ justifyContent: 'center', marginTop: 24 }}>
          <button type="button" className="btn btn-secondary" onClick={() => { onReview(); setStepIdx(0); }}>
            <RotateCcw size={16} /> {tr('Review this lesson', 'यह पाठ दोहराएँ')}
          </button>
          {next ? (
            <button type="button" className="btn btn-primary" onClick={next.go}>
              {tr(`Next: Lesson ${next.no}`, `अगला: पाठ ${next.no}`)} <ArrowRight size={16} />
            </button>
          ) : (
            <span className="subtext" style={{ alignSelf: 'center' }}>{tr('🎉 You have finished the whole course!', '🎉 आपने पूरा कोर्स पूरा कर लिया!')}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="lx-lesson-kicker">{tr(`Lesson ${lessonNo}`, `पाठ ${lessonNo}`)} · {L(course.title)}</p>
      <h2>{L(lesson.title)}</h2>
      <p className="lx-lesson-sub">{L(lesson.summary)}</p>

      <div className="lx-tabs" role="tablist" aria-label={tr('Lesson steps', 'पाठ के चरण')}>
        {steps.map((s, i) => {
          const M = STEP_META[s];
          const done = doneSteps.includes(s) || finished;
          return (
            <React.Fragment key={s}>
              {i > 0 && <span className="lx-tab-sep" aria-hidden="true" />}
              <button
                type="button"
                role="tab"
                aria-selected={i === stepIdx}
                disabled={!canOpen(i)}
                className={`lx-tab${i === stepIdx ? ' active' : ''}${done ? ' done' : ''}`}
                onClick={() => setStepIdx(i)}
                title={!canOpen(i) ? tr('Finish the step before first', 'पहले पिछला चरण पूरा करें') : undefined}
              >
                <span className="n">{done ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
                <M.icon size={16} /> {tr(M.en, M.hi)}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {step === 'watch' && (
        <WatchStep
          lesson={lesson}
          storageKey={`${course.id}-${lesson.id}`}
          done={doneSteps.includes('watch') || finished}
          onDone={() => onStepDone('watch')}
          onNext={advance}
        />
      )}
      {step === 'read' && (
        <ReadStep
          lesson={lesson}
          onDone={() => {
            onStepDone('read');
            advance();
          }}
        />
      )}
      {step === 'quiz' && (
        <QuizStep
          lesson={lesson}
          onDone={onLessonDone}
        />
      )}
    </div>
  );
};

// "How was this lesson?" Shown once per lesson when it is finished. Saved on the device and, when
// she is signed in, in her account.
const LessonFeedback = ({ courseId, lessonId }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const [sent, setSent] = useState(() => hasLessonFeedback(courseId, lessonId));
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  if (sent) {
    return <p className="lx-fb-thanks" role="status"><Check size={16} /> {tr('Thanks for your feedback on this lesson.', 'इस पाठ पर आपकी राय के लिए धन्यवाद।')}</p>;
  }

  const send = async (e) => {
    e.preventDefault();
    if (!rating) { setProblem(tr('Please choose a star rating.', 'कृपया स्टार रेटिंग चुनें।')); return; }
    setBusy(true);
    try {
      await addFeedback({ rating, category: LESSON_CATEGORY, message: text, course: courseId, lessonId });
      setSent(true);
    } catch {
      setProblem(tr('Could not save. Please try again.', 'सहेज नहीं पाए। कृपया फिर कोशिश करें।'));
    } finally {
      setBusy(false);
    }
  };

  const shown = hover || rating;
  return (
    <form className="lx-fb" onSubmit={send} noValidate>
      <h3>{tr('How was this lesson?', 'यह पाठ कैसा रहा?')}</h3>
      <div role="radiogroup" aria-label={tr('Rating', 'रेटिंग')} className="lx-fb-stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n}`} onClick={() => { setRating(n); setProblem(''); }} onMouseEnter={() => setHover(n)}>
            <Star size={30} color="#e8a317" fill={n <= shown ? '#e8a317' : 'none'} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        maxLength={300}
        rows={2}
        onChange={(e) => setText(e.target.value)}
        placeholder={tr('Anything unclear or missing? (optional)', 'कुछ समझ नहीं आया या छूट गया? (वैकल्पिक)')}
        aria-label={tr('Comment (optional)', 'टिप्पणी (वैकल्पिक)')}
      />
      {problem && <p role="alert" style={{ color: '#c53030', fontWeight: 600, fontSize: '.9rem' }}>{problem}</p>}
      <button type="submit" className="btn btn-secondary" disabled={busy}>{busy ? tr('Saving...', 'सहेज रहे हैं...') : tr('Send feedback', 'राय भेजें')}</button>
    </form>
  );
};

const WatchStep = ({ lesson, storageKey, done, onDone, onNext }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const ref = useRef(null);
  const [watched, setWatched] = useState(done ? 1 : 0);
  const [subs, setSubs] = useState(lang === 'hi' ? 'hi' : 'en');
  const reported = useRef(done);
  const v = lesson.video;
  const posKey = `learnVideoPos-${storageKey}`;

  // show the chosen subtitles (or none)
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const apply = () => {
      for (const t of el.textTracks) t.mode = t.language === subs ? 'showing' : 'disabled';
    };
    apply();
    el.textTracks.addEventListener?.('addtrack', apply);
    return () => el.textTracks.removeEventListener?.('addtrack', apply);
  }, [subs]);

  const onTime = () => {
    const el = ref.current;
    if (!el?.duration) return;
    // count only what was actually played (skipping ahead does not count)
    let played = 0;
    for (let i = 0; i < el.played.length; i++) played += el.played.end(i) - el.played.start(i);
    const share = Math.max(watched, Math.min(1, played / el.duration));
    setWatched(share);
    try {
      localStorage.setItem(posKey, String(el.currentTime));
    } catch {
      // ignore
    }
    if (share >= WATCH_TO_FINISH && !reported.current) {
      reported.current = true;
      onDone();
    }
  };
  const onLoaded = () => {
    try {
      const pos = Number(localStorage.getItem(posKey));
      if (pos > 2 && ref.current && pos < ref.current.duration - 3) ref.current.currentTime = pos;
    } catch {
      // ignore
    }
  };
  const onEnded = () => {
    try {
      localStorage.removeItem(posKey);
    } catch {
      // ignore
    }
  };

  const ok = watched >= WATCH_TO_FINISH || done;
  return (
    <div className="fade-in">
      <div className="lx-video">
        <video ref={ref} controls playsInline preload="metadata" poster={v.poster} onTimeUpdate={onTime} onLoadedMetadata={onLoaded} onEnded={onEnded}>
          <source src={v.src} type="video/mp4" />
          {v.tracks.map((t) => <track key={t.lang} kind="subtitles" srcLang={t.lang} label={t.label} src={t.src} default={t.lang === subs} />)}
        </video>
      </div>
      <div className="lx-video-meta">
        {v.ai && <span className="lx-badge-ai"><Sparkles size={12} /> {tr('AI-generated video', 'AI से बना वीडियो')}</span>}
        <span>{tr('Narration: Hindi', 'आवाज़: हिंदी')}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {tr('Subtitles', 'सबटाइटल')}
          <span className="lx-subs" role="group" aria-label={tr('Subtitles', 'सबटाइटल')}>
            {[...v.tracks.map((t) => ({ id: t.lang, label: t.label })), { id: 'off', label: tr('Off', 'बंद') }].map((o) => (
              <button key={o.id} type="button" aria-pressed={subs === o.id} onClick={() => setSubs(o.id)}>{o.label}</button>
            ))}
          </span>
        </span>
      </div>
      <div className="lx-watch">
        <div className="lx-watchbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(watched * 100)} aria-label={tr('Watched', 'देखा गया')}>
          <span style={{ width: `${Math.round(watched * 100)}%` }} />
        </div>
        <span className="subtext" style={{ fontSize: '.85rem' }}>
          {ok ? tr('✓ Watched', '✓ देख लिया') : tr(`${Math.round(watched * 100)}% watched · watch ${WATCH_TO_FINISH * 100}% to continue`, `${Math.round(watched * 100)}% देखा · आगे बढ़ने के लिए ${WATCH_TO_FINISH * 100}% देखें`)}
        </span>
        <button type="button" className="btn btn-primary" disabled={!ok} style={!ok ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none' } : undefined} onClick={onNext}>
          {tr('Next: Read', 'आगे: पढ़ें')} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const ReadStep = ({ lesson, onDone }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const other = lang === 'hi' ? 'en' : 'hi';
  const [i, setI] = useState(0);
  const card = lesson.read[i];
  const last = i === lesson.read.length - 1;
  return (
    <div>
      <div className="lx-card fade-in" key={i}>
        <div className="lx-card-ic" aria-hidden="true">{card.icon}</div>
        <div>
          <p className="lx-lesson-kicker" style={{ color: 'var(--text-muted)' }}>{tr(`Key point ${i + 1} of ${lesson.read.length}`, `मुख्य बात ${i + 1} / ${lesson.read.length}`)}</p>
          <h3 className={lang === 'hi' ? 'lx-hi' : undefined}>{card.title[lang]}</h3>
          <p className={`lx-card-body${lang === 'hi' ? ' lx-hi' : ''}`}>{card.body[lang]}</p>
          <p className={`lx-card-alt${other === 'hi' ? ' lx-hi' : ''}`}>{card.body[other]}</p>
        </div>
      </div>
      <div className="lx-dots" aria-hidden="true">{lesson.read.map((_, k) => <span key={k} className={k === i ? 'on' : ''} />)}</div>
      <div className="lx-nav">
        <button type="button" className="btn btn-secondary" disabled={i === 0} style={i === 0 ? { visibility: 'hidden' } : undefined} onClick={() => setI(i - 1)}>
          <ArrowLeft size={16} /> {tr('Back', 'पीछे')}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => (last ? onDone() : setI(i + 1))}>
          {last ? tr('Next: Quiz', 'आगे: क्विज़') : tr('Next point', 'अगली बात')} <ArrowRight size={16} />
        </button>
      </div>
      {lesson.related && (
        <p className="lx-related">
          <ExternalLink size={16} />
          <span>{tr('Want more? ', 'और जानना है? ')}<a href={lesson.related.url} target="_blank" rel="noreferrer">{lesson.related.title}</a></span>
        </p>
      )}
    </div>
  );
};

const QuizStep = ({ lesson, onDone }) => {
  const { lang } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const cur = lesson.quiz[q];
  const right = picked != null && picked === cur.answer;

  const pick = (opt) => {
    setPicked(opt);
    timer.current = setTimeout(() => {
      if (opt !== cur.answer) {
        setPicked(null); // try again
        return;
      }
      if (q < lesson.quiz.length - 1) {
        setQ(q + 1);
        setPicked(null);
      } else {
        onDone();
      }
    }, opt === cur.answer ? 700 : 1100);
  };

  return (
    <div className="fade-in" key={q}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span className="lx-lesson-kicker">{tr('Knowledge check', 'समझ की जाँच')}</span>
        <span style={{ fontWeight: 600, color: 'var(--lx-accent, var(--primary))', fontSize: '.9rem' }}>
          {tr(`Question ${q + 1} of ${lesson.quiz.length}`, `प्रश्न ${q + 1} / ${lesson.quiz.length}`)}
        </span>
      </div>
      <div className="lx-dots" style={{ justifyContent: 'flex-start', margin: '10px 0 0' }} aria-hidden="true">
        {lesson.quiz.map((_, k) => <span key={k} className={k === q ? 'on' : ''} style={k < q ? { background: '#68d391' } : undefined} />)}
      </div>
      <p className="lx-q">{cur.question}</p>
      <div className="lx-opts">
        {cur.options.map((opt) => (
          <button key={opt} type="button" className={`lx-opt${picked === opt ? (right ? ' right' : ' wrong') : ''}`} disabled={picked != null} onClick={() => pick(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <p className={`lx-feedback${picked == null ? '' : right ? ' right' : ' wrong'}`} aria-live="polite">
        {picked == null ? '' : right ? tr('✓ Correct!', '✓ सही!') : tr('Not quite — try again.', 'सही नहीं — फिर से कोशिश करें।')}
      </p>
    </div>
  );
};

export default LessonView;
