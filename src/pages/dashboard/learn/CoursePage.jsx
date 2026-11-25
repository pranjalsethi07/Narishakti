import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Clapperboard, Clock, ListChecks, Lock, Repeat } from 'lucide-react';
import { useLanguage } from '../../../context/languageContextValue';
import { COURSES, levelOf } from '../../../data/courses';
import {
  coursePercent, getLessonSteps, getOpenAll, getStoredLearnProgress, lessonFraction,
  markLessonDone, markStepDone, setOpenAll,
} from '../../../utils/learningProgress';
import { awardLessonCoins, COIN_RULES } from '../../../utils/coins';
import ProgressRing from '../../../components/ProgressRing';
import LessonView from './LessonView';

// Each lesson is done, the one you are on ("here"), open (only with "Open all lessons" on), or locked
// until the one before it is done — as in the NCERT LMS course page.
const lessonStates = (course, progress, openAll) => {
  const current = course.lessons.find((l) => !progress[course.id].includes(l.id));
  let earlierOpen = false;
  return course.lessons.map((l) => {
    const finished = progress[course.id].includes(l.id);
    const state = finished ? 'done' : !openAll && earlierOpen ? 'locked' : l.id === current?.id ? 'here' : 'open';
    if (!finished) earlierOpen = true;
    return state;
  });
};

const CoursePage = ({ courseId }) => {
  const course = COURSES[courseId];
  const { lang, toggleLanguage } = useLanguage();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const L = (o) => o?.[lang] ?? o?.en;
  const [params, setParams] = useSearchParams();
  const [progress, setProgress] = useState(getStoredLearnProgress);
  const [steps, setSteps] = useState(getLessonSteps);
  const [openAll, setOpenAllState] = useState(getOpenAll);
  // the lesson just finished: kept on screen (its "complete" view) until the learner moves on
  const [justDone, setJustDone] = useState(null);
  // coins given for the lesson just finished (0 when she had already earned them)
  const [coinsGiven, setCoinsGiven] = useState(0);

  const states = useMemo(() => (course ? lessonStates(course, progress, openAll) : []), [course, progress, openAll]);
  if (!course) return <Navigate to="/dashboard/learn" replace />;

  const currentIdx = Math.max(0, states.findIndex((s) => s !== 'done'));
  const asked = Number(params.get('lesson'));
  const selIdx = course.lessons.findIndex((l) => l.id === (asked || justDone));
  const idx = selIdx >= 0 ? selIdx : currentIdx;
  const lesson = course.lessons[idx];
  const state = states[idx];
  const doneN = states.filter((s) => s === 'done').length;
  const lockedN = states.filter((s) => s === 'locked').length;
  const pct = coursePercent(course, progress, steps);
  const videos = course.lessons.filter((l) => l.video).length;
  const minutes = course.lessons.reduce((m, l) => m + l.minutes, 0);
  const allDone = doneN === course.lessons.length;
  const currentLevel = levelOf(course, course.lessons[currentIdx]);

  const open = (i) => {
    setJustDone(null);
    setParams({ lesson: String(course.lessons[i].id) });
    requestAnimationFrame(() => document.getElementById('lx-lesson')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const toggleOpenAll = () => {
    setOpenAll(!openAll);
    setOpenAllState(!openAll);
  };
  const stepDone = (step) => setSteps({ ...markStepDone(course.id, lesson.id, step) });
  const lessonDone = () => {
    setJustDone(lesson.id);
    setCoinsGiven(awardLessonCoins(course.id, lesson.id) ? COIN_RULES.lesson : 0);
    setProgress({ ...markLessonDone(course.id, lesson.id) });
    setSteps(getLessonSteps());
  };

  const accentVars = { '--lx-accent': course.accent, '--lx-accent-soft': `${course.accent}33` };

  return (
    <div className="fade-in" style={accentVars}>
      <header className="lx-hero" style={{ background: course.gradient }}>
        <span className="lx-glow a" aria-hidden="true" />
        <span className="lx-glow b" aria-hidden="true" />
        <div className="lx-hero-top">
          <Link to="/dashboard/learn" className="lx-back"><ArrowLeft size={16} /> {tr('All courses', 'सभी कोर्स')}</Link>
          <span className="lx-spacer" />
          <div className={`lx-demo${openAll ? ' on' : ''}`}>
            <div className="lx-demo-text">
              <b><span className="lx-tag">{tr('DEMO', 'डेमो')}</span>{tr('Open all lessons', 'सभी पाठ खोलें')}</b>
              <small>{openAll ? tr('On: every lesson is open. Turn off to lock them in order again.', 'चालू: सभी पाठ खुले हैं। फिर से क्रम से बंद करने के लिए बंद करें।') : tr('Off: each lesson opens after the one before is done.', 'बंद: हर पाठ पिछला पूरा होने पर खुलता है।')}</small>
            </div>
            <button type="button" role="switch" aria-checked={openAll} aria-label={tr('Open all lessons (demo)', 'सभी पाठ खोलें (डेमो)')} className="lx-switch" onClick={toggleOpenAll}><span /></button>
          </div>
          <button type="button" className="lx-langbtn" onClick={toggleLanguage}>
            <Repeat size={14} /> {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
          <div className="lx-pct">
            <ProgressRing value={pct / 100} size={34} stroke={4} color="#fff" track="rgba(255,255,255,.25)" label={`${pct}%`}>
              <span style={{ fontSize: '.62rem', fontWeight: 700 }}>{pct}%</span>
            </ProgressRing>
            <span><b>{tr(`${pct}% done`, `${pct}% पूरा`)}</b><small>{tr(`${doneN} of ${course.lessons.length} lessons`, `${course.lessons.length} में से ${doneN} पाठ`)}</small></span>
          </div>
        </div>

        <div className="lx-title-row">
          <h1 className="lx-native">{course.native}</h1>
          <p className="lx-sub">{course.title.en}</p>
          <span className="lx-chips" style={{ marginTop: 0 }}>
            <span className="lx-chip"><BookOpen size={13} /> {tr(`${course.lessons.length} lessons`, `${course.lessons.length} पाठ`)}</span>
            {videos > 0 && <span className="lx-chip lx-ai"><Clapperboard size={13} /> {tr(`${videos} AI videos`, `${videos} AI वीडियो`)}</span>}
            <span className="lx-chip"><ListChecks size={13} /> {tr(`${course.lessons.length} quizzes`, `${course.lessons.length} क्विज़`)}</span>
            <span className="lx-chip"><Clock size={13} /> {tr(`~${minutes} min`, `~${minutes} मिनट`)}</span>
          </span>
        </div>

        <LessonTrack course={course} states={states} steps={steps} progress={progress} selIdx={idx} onOpen={open} tr={tr} L={L}
          summary={
            <>
              <b>{allDone ? tr(`All ${course.lessons.length} lessons done`, `सभी ${course.lessons.length} पाठ पूरे`) : tr(`You are on Lesson ${currentIdx + 1} of ${course.lessons.length}`, `आप ${course.lessons.length} में से पाठ ${currentIdx + 1} पर हैं`)}</b>
              <span style={{ color: 'var(--text-muted)' }}> · <span className="lx-done-n">{tr(`${doneN} done`, `${doneN} पूरे`)}</span>{lockedN > 0 && ` · ${tr(`${lockedN} locked`, `${lockedN} बंद`)}`}</span>
              {!allDone && currentLevel && (
                <span style={{ color: 'var(--text-muted)' }}> · {tr('Level', 'स्तर')} {currentLevel.id}: {L(currentLevel.title)}</span>
              )}
            </>
          }
        />
      </header>

      <div className="lx-lesson" id="lx-lesson">
        <section className="lx-panel" aria-label={L(lesson.title)}>
          {state === 'locked' ? (
            <div className="lx-locked">
              <div className="lx-lock"><Lock size={28} /></div>
              <h2 style={{ fontSize: '1.3rem' }}>{tr(`Lesson ${idx + 1} is locked`, `पाठ ${idx + 1} बंद है`)}</h2>
              <p className="subtext" style={{ margin: '6px auto 18px', maxWidth: 420 }}>
                {tr(`It opens once you finish Lesson ${currentIdx + 1}: ${course.lessons[currentIdx].title.en}.`, `पाठ ${currentIdx + 1} (${course.lessons[currentIdx].title.hi}) पूरा करने पर यह खुलेगा।`)}
              </p>
              <button type="button" className="btn btn-primary" onClick={() => open(currentIdx)}>{tr(`Go to Lesson ${currentIdx + 1}`, `पाठ ${currentIdx + 1} पर जाएँ`)}</button>
            </div>
          ) : (
            <LessonView
              key={`${course.id}-${lesson.id}`}
              course={course}
              lesson={lesson}
              lessonNo={idx + 1}
              doneSteps={steps[`${course.id}-${lesson.id}`] || []}
              finished={state === 'done'}
              celebrate={justDone === lesson.id}
              coins={coinsGiven}
              onReview={() => setJustDone(null)}
              openAll={openAll}
              onStepDone={stepDone}
              onLessonDone={lessonDone}
              next={idx + 1 < course.lessons.length ? { no: idx + 2, title: L(course.lessons[idx + 1].title), go: () => open(idx + 1) } : null}
            />
          )}
        </section>

        <aside className="lx-panel lx-side">
          <h4>{tr('In this course', 'इस कोर्स में')}</h4>
          <ol>
            {course.lessons.map((l, i) => (
              <React.Fragment key={l.id}>
              {(i === 0 || l.level !== course.lessons[i - 1].level) && (
                <li className="lx-level">{tr(`Level ${l.level}`, `स्तर ${l.level}`)} · {L(levelOf(course, l)?.title)}</li>
              )}
              <li>
                <button type="button" className={i === idx ? 'sel' : ''} onClick={() => open(i)}>
                  <Node state={states[i]} no={i + 1} />
                  <span className="lx-side-t">
                    <span style={{ fontWeight: states[i] === 'locked' ? 400 : 600, color: states[i] === 'locked' ? '#a0aec0' : undefined }}>{L(l.title)}</span>
                    <small>
                      {l.video ? tr('AI video · ', 'AI वीडियो · ') : ''}{tr(`${l.minutes} min`, `${l.minutes} मिनट`)} ·{' '}
                      {states[i] === 'done' ? tr('Completed', 'पूरा') : states[i] === 'locked' ? tr('Locked', 'बंद') : tr(`${Math.round(lessonFraction(course, l, progress, steps) * 100)}% done`, `${Math.round(lessonFraction(course, l, progress, steps) * 100)}% पूरा`)}
                    </small>
                  </span>
                </button>
              </li>
              </React.Fragment>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
};

const Node = ({ state, no }) => (
  <span className={`lx-node ${state}`} aria-hidden="true">
    {state === 'done' ? <Check size={17} strokeWidth={3} /> : state === 'locked' ? <Lock size={15} /> : no}
  </span>
);

const LessonTrack = ({ course, states, steps, progress, selIdx, onOpen, tr, L, summary }) => {
  const listRef = useRef(null);
  // With 20 lessons the track scrolls sideways: keep the selected lesson in view.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector('li[data-selected="true"]');
    if (!list || !item) return;
    const offset = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
    const left = list.scrollLeft + offset - (list.clientWidth - item.offsetWidth) / 2;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: Math.max(0, left), behavior: calm ? 'auto' : 'smooth' });
  }, [selIdx]);
  const legend = [
    { color: '#38a169', label: tr('Done', 'पूरा') },
    { color: course.accent, label: tr('You are here', 'आप यहाँ हैं') },
    ...(states.includes('locked') ? [{ color: '#cbd5e0', label: tr('Locked', 'बंद') }] : []),
  ];
  return (
    <section className="lx-track" aria-label={tr('Your lessons', 'आपके पाठ')}>
      <div className="lx-track-head">
        <p>{summary}</p>
        <ul className="lx-legend" aria-label={tr('Key', 'संकेत')}>
          {legend.map((l) => <li key={l.label}><i style={{ background: l.color }} />{l.label}</li>)}
        </ul>
      </div>
      <ol className="lx-steps" ref={listRef}>
        {course.lessons.map((l, i) => {
          const s = states[i];
          const pct = Math.round(lessonFraction(course, l, progress, steps) * 100);
          return (
            <li
              key={l.id}
              className={i > 0 && l.level !== course.lessons[i - 1].level ? 'lvl-start' : undefined}
              data-selected={i === selIdx}
              aria-current={s === 'here' ? 'step' : undefined}
            >
              {i < course.lessons.length - 1 && <span className={`lx-line${s === 'done' ? ' done' : ''}`} aria-hidden="true" />}
              <button
                type="button"
                className={`lx-step-btn${i === selIdx ? ' selected' : ''}`}
                onClick={() => onOpen(i)}
                title={`${tr(`Lesson ${i + 1}`, `पाठ ${i + 1}`)}: ${L(l.title)}${s === 'locked' ? ` — ${tr('opens once the lesson before is done', 'पिछला पाठ पूरा होने पर खुलेगा')}` : ''}`}
              >
                <Node state={s} no={i + 1} />
                <span className={`lx-step-no ${s}`}>{tr(`Lesson ${i + 1}`, `पाठ ${i + 1}`)}{l.video && <span className="lx-ai-dot">AI</span>}</span>
                <span className={`lx-step-title${s === 'locked' ? ' dim' : ''}`}>{L(l.title)}</span>
                {s === 'here' && <span className="lx-mini" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>}
                <span className={`lx-step-status${s === 'done' ? ' done' : ''}`}>
                  {s === 'done' ? tr('Completed', 'पूरा') : s === 'locked' ? tr('Locked', 'बंद') : tr(`${pct}% done`, `${pct}% पूरा`)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default CoursePage;
