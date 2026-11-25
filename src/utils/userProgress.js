import { getStoredLearnProgress } from './learningProgress';
import { notifyProgressChanged } from '../lib/sync';

const QUESTIONS_ASKED_KEY = 'questionsAskedCount';
const STREAK_KEY = 'dailyStreakMeta';

export const todayString = () => {
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
  notifyProgressChanged();
  return next;
};

export const getQuestionsAskedCount = () => Number(localStorage.getItem(QUESTIONS_ASKED_KEY) || '0');

// A broken streak can be won back with coins for this many days after the break was noticed.
export const RESTORE_WINDOW_DAYS = 7;

const daysBetween = (fromText, toText) => Math.round((new Date(toText) - new Date(fromText)) / 86400000);

const readStreakMeta = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STREAK_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

// The saved record is { streak, lastActiveDate } plus, after a break, lost: { streak, offeredOn }
// (the streak that was lost and the day we noticed). Dropped once the restore window has passed.
const liveLost = (lost, today) =>
  lost && Number(lost.streak) >= 2 && /^\d{4}-\d{2}-\d{2}$/.test(String(lost.offeredOn || '')) && daysBetween(lost.offeredOn, today) <= RESTORE_WINDOW_DAYS
    ? { streak: Number(lost.streak), offeredOn: lost.offeredOn }
    : null;

export const recordDailyActivity = () => {
  const raw = localStorage.getItem(STREAK_KEY);
  const today = todayString();

  let streak = 1;
  let lost = null;

  if (raw) {
    const parsed = readStreakMeta();
    if (parsed) {
      const prevStreak = Number(parsed.streak || 0);
      const prevDate = String(parsed.lastActiveDate || '');
      lost = liveLost(parsed.lost, today);

      if (prevDate === today) {
        streak = prevStreak || 1;
      } else if (prevDate && previousDayString(today) === prevDate) {
        streak = Math.max(1, prevStreak + 1);
      } else if (prevDate && prevStreak >= 2) {
        // a day or more was missed: the streak breaks, and she can win it back with coins
        lost = { streak: prevStreak, offeredOn: today };
      }
    }
  }

  const payload = { streak, lastActiveDate: today, ...(lost ? { lost } : {}) };
  const serialized = JSON.stringify(payload);
  // Only save (and back up) when something changed. This runs on many page loads.
  if (raw !== serialized) {
    localStorage.setItem(STREAK_KEY, serialized);
    notifyProgressChanged();
  }
  return streak;
};

// { lostStreak, offeredOn, expiresOn, current } while a broken streak can still be restored, else null.
export const getRestorableStreak = () => {
  const meta = readStreakMeta();
  const today = todayString();
  const lost = liveLost(meta?.lost, today);
  if (!lost) return null;
  const expires = new Date(lost.offeredOn);
  expires.setDate(expires.getDate() + RESTORE_WINDOW_DAYS);
  return { lostStreak: lost.streak, offeredOn: lost.offeredOn, expiresOn: expires.toISOString().slice(0, 10), current: Number(meta.streak) || 1 };
};

// Brings the lost streak back: the lost days count again, and the days kept since are added on top.
// Returns the new streak, or null if there is nothing to restore.
export const applyStreakRestore = () => {
  const info = getRestorableStreak();
  if (!info) return null;
  const streak = info.lostStreak + info.current;
  localStorage.setItem(STREAK_KEY, JSON.stringify({ streak, lastActiveDate: todayString() }));
  notifyProgressChanged();
  window.dispatchEvent(new Event('naari-progress-synced')); // headers and the dashboard refresh
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
