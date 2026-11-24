import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Clapperboard, ListChecks } from 'lucide-react';
import { useLanguage } from '../../context/languageContextValue';
import { COURSES, COURSE_ORDER } from '../../data/courses';
import { coursePercent, getLessonSteps, getStoredLearnProgress } from '../../utils/learningProgress';
import CoursePage from './learn/CoursePage';
import './learn/learn.css';

// /dashboard/learn            → the courses
// /dashboard/learn/:courseId  → one course, taken lesson by lesson (?lesson=N opens a lesson)
const Learn = () => {
  const { courseId } = useParams();
  if (courseId) return <CoursePage key={courseId} courseId={courseId} />;
  return <Catalog />;
};

const Catalog = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const tr = (en, hi) => (lang === 'hi' ? hi : en);
  const progress = useState(getStoredLearnProgress)[0];
  const steps = useState(getLessonSteps)[0];

  return (
    <div className="fade-in">
      <div className="lx-catalog-head">
        <div>
          <h1 className="h2">{tr('Learn step by step', 'स्टेप-बाय-स्टेप सीखें')}</h1>
          <p>{tr('Short lessons with AI videos, simple notes and a quiz. Each lesson opens once the one before is done.', 'AI वीडियो, आसान नोट्स और क्विज़ वाले छोटे पाठ। हर पाठ पिछला पूरा होने पर खुलता है।')}</p>
        </div>
      </div>

      <div className="lx-courses">
        {COURSE_ORDER.map((id) => {
          const c = COURSES[id];
          const pct = coursePercent(c, progress, steps);
          const done = progress[id].length;
          const videos = c.lessons.filter((l) => l.video).length;
          return (
            <button key={id} type="button" className="lx-course-card" style={{ background: c.gradient }} onClick={() => navigate(`/dashboard/learn/${id}`)}>
              <span className="lx-glow" aria-hidden="true" />
              <span className="lx-emoji" aria-hidden="true">{c.emoji}</span>
              <span className="lx-native">{c.native}</span>
              <h3>{c.title.en}</h3>
              <p className="lx-tagline">{c.tagline[lang] || c.tagline.en}</p>
              <span className="lx-chips">
                <span className="lx-chip"><BookOpen size={13} /> {tr(`${c.lessons.length} lessons`, `${c.lessons.length} पाठ`)}</span>
                {videos > 0 && <span className="lx-chip lx-ai"><Clapperboard size={13} /> {tr(`${videos} AI videos`, `${videos} AI वीडियो`)}</span>}
                <span className="lx-chip"><ListChecks size={13} /> {tr(`${c.lessons.length} quizzes`, `${c.lessons.length} क्विज़`)}</span>
              </span>
              <span className="lx-card-foot">
                <span className="lx-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
                <span style={{ fontSize: '.8rem', fontWeight: 600 }}>{tr(`${done}/${c.lessons.length} done`, `${done}/${c.lessons.length} पूरे`)}</span>
                <span className="lx-go">
                  {pct === 0 ? tr('Start', 'शुरू करें') : pct === 100 ? tr('Review', 'दोहराएँ') : tr('Continue', 'जारी रखें')} <ArrowRight size={16} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Learn;
