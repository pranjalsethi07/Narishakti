import { getStoredLearnProgress } from './learningProgress';

const QUESTIONS_ASKED_KEY = 'questionsAskedCount';
const STREAK_KEY = 'dailyStreakMeta';

const todayString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const previousDayString = (dateText) => {
  const dt = new Date(dateText);
  dt.setDate(dt.getDate() - 1);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const incrementQuestionsAsked = () => {
  const prev = Number(localStorage.getItem(QUESTIONS_ASKED_KEY) || '0');
  const next = prev + 1;
  localStorage.setItem(QUESTIONS_ASKED_KEY, String(next));
  return next;
};

export const getQuestionsAskedCount = () => Number(localStorage.getItem(QUESTIONS_ASKED_KEY) || '0');

export const recordDailyActivity = () => {
  const raw = localStorage.getItem(STREAK_KEY);
  const today = todayString();

  let streak = 1;
  let lastActiveDate = today;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const prevStreak = Number(parsed.streak || 0);
      const prevDate = String(parsed.lastActiveDate || '');

      if (prevDate === today) {
        streak = prevStreak || 1;
      } else if (prevDate && previousDayString(today) === prevDate) {
        streak = Math.max(1, prevStreak + 1);
      }
    } catch {
      streak = 1;
    }
  }

  const payload = { streak, lastActiveDate };
  localStorage.setItem(STREAK_KEY, JSON.stringify(payload));
  return streak;
};

export const getDayStreakCount = () => {
  const raw = localStorage.getItem(STREAK_KEY);
  if (!raw) return 0;

  try {
    const parsed = JSON.parse(raw);
    return Number(parsed.streak || 0);
  } catch {
    return 0;
  }
};

export const getTopicsCompletedCount = () => {
  const progress = getStoredLearnProgress();
  return (progress.health?.length || 0) + (progress.finance?.length || 0);
};
