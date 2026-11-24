import { COURSES, stepsOf } from '../data/courses';

// learnProgress: { health: [lessonId…], finance: [lessonId…] } — the lessons finished (their quiz passed).
// learnSteps:    { 'health-2': ['watch', 'read'] } — the steps done inside lessons not yet finished.
// learnOpenAll:  'true' when the demo switch "Open all lessons" is on.
const DEFAULT_PROGRESS = { health: [], finance: [] };
const STEPS_KEY = 'learnSteps';
const OPEN_ALL_KEY = 'learnOpenAll';

export const LEARNING_MODULE_SEQUENCE = Object.fromEntries(
  Object.values(COURSES).map((c) => [c.id, c.lessons.map((l) => ({ id: l.id, title: l.title.en, duration: `${l.minutes} min` }))])
);

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode); progress lasts for this visit only
  }
};

export const getStoredLearnProgress = () => {
  const parsed = readJson('learnProgress', DEFAULT_PROGRESS) || DEFAULT_PROGRESS;
  return {
    health: Array.isArray(parsed.health) ? parsed.health : [],
    finance: Array.isArray(parsed.finance) ? parsed.finance : [],
  };
};

export const getLessonSteps = () => readJson(STEPS_KEY, {}) || {};

export const markStepDone = (courseId, lessonId, step) => {
  const all = getLessonSteps();
  const k = `${courseId}-${lessonId}`;
  const done = new Set(all[k] || []);
  done.add(step);
  all[k] = [...done];
  writeJson(STEPS_KEY, all);
  return all;
};

export const markLessonDone = (courseId, lessonId) => {
  const progress = getStoredLearnProgress();
  if (!progress[courseId].includes(lessonId)) progress[courseId] = [...progress[courseId], lessonId];
  writeJson('learnProgress', progress);
  markStepDone(courseId, lessonId, 'quiz');
  return progress;
};

export const getOpenAll = () => {
  try {
    return localStorage.getItem(OPEN_ALL_KEY) === 'true';
  } catch {
    return false;
  }
};
export const setOpenAll = (on) => {
  try {
    localStorage.setItem(OPEN_ALL_KEY, on ? 'true' : 'false');
  } catch {
    // ignore
  }
};

// Share of a lesson done, 0–1: a finished lesson is 1, otherwise its steps done out of its steps.
export const lessonFraction = (course, lesson, progress, steps) => {
  if (progress[course.id]?.includes(lesson.id)) return 1;
  const all = stepsOf(lesson);
  const done = (steps[`${course.id}-${lesson.id}`] || []).filter((s) => all.includes(s)).length;
  return done / all.length;
};

export const coursePercent = (course, progress, steps) =>
  Math.round((course.lessons.reduce((sum, l) => sum + lessonFraction(course, l, progress, steps), 0) / course.lessons.length) * 100);

export const getFirstIncompleteIndex = (category, progress) => {
  const modules = LEARNING_MODULE_SEQUENCE[category] || [];
  const completed = progress?.[category] || [];
  const idx = modules.findIndex((m) => !completed.includes(m.id));
  return idx === -1 ? modules.length - 1 : idx;
};

export const getRecommendedCategory = (progress) => {
  const healthIncomplete = getFirstIncompleteIndex('health', progress);
  const financeIncomplete = getFirstIncompleteIndex('finance', progress);

  const healthDone = (progress?.health || []).length;
  const financeDone = (progress?.finance || []).length;

  if (healthDone === LEARNING_MODULE_SEQUENCE.health.length && financeDone < LEARNING_MODULE_SEQUENCE.finance.length) {
    return 'finance';
  }
  if (financeDone === LEARNING_MODULE_SEQUENCE.finance.length && healthDone < LEARNING_MODULE_SEQUENCE.health.length) {
    return 'health';
  }

  return healthIncomplete <= financeIncomplete ? 'health' : 'finance';
};

export const getContinueLearningMeta = (progress) => {
  const category = getRecommendedCategory(progress);
  const modules = LEARNING_MODULE_SEQUENCE[category] || [];
  const idx = getFirstIncompleteIndex(category, progress);
  const safeIdx = idx < 0 ? 0 : idx;
  const module = modules[safeIdx] || modules[0];

  const completedCount = (progress?.[category] || []).length;
  const total = modules.length || 1;
  const completionPercent = Math.round((completedCount / total) * 100);

  return {
    category,
    module,
    moduleNumber: Math.min(safeIdx + 1, total),
    completionPercent,
  };
};
