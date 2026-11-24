import { getDayStreakCount, getQuestionsAskedCount, getTopicsCompletedCount } from './userProgress';
import { getProgress, totalBadges } from '../data/gamesData';

// Your level comes from XP earned by using the app:
//   10 XP per lesson completed, 5 XP per game badge, 2 XP per question asked,
//   3 XP for each day of your current streak.
export const XP_RULES = { lesson: 10, badge: 5, question: 2, streakDay: 3 };

export const LEVELS = [
  { min: 0, name: { en: 'Beginner', hi: 'शुरुआती' } },
  { min: 20, name: { en: 'Learner', hi: 'शिक्षार्थी' } },
  { min: 60, name: { en: 'Explorer', hi: 'खोजी' } },
  { min: 120, name: { en: 'Achiever', hi: 'सफल' } },
  { min: 200, name: { en: 'Champion', hi: 'चैंपियन' } },
  { min: 320, name: { en: 'Shakti', hi: 'शक्ति' } },
];

export const getXp = () =>
  getTopicsCompletedCount() * XP_RULES.lesson +
  totalBadges(getProgress()) * XP_RULES.badge +
  getQuestionsAskedCount() * XP_RULES.question +
  getDayStreakCount() * XP_RULES.streakDay;

// Everything the UI needs to show a level and how close you are to the next one.
export const getLevelInfo = (xp = getXp()) => {
  let index = 0;
  LEVELS.forEach((level, i) => { if (xp >= level.min) index = i; });

  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const percent = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;

  return { xp, level: index + 1, name: current.name, next, toNext: next ? next.min - xp : 0, percent };
};
