import { supabase } from './supabaseClient';
import { currentAccountId } from './sync';

// App feedback. It is saved on this device first, then uploaded to the account when she is
// signed in (a guest's feedback is uploaded the next time she opens Feedback after signing in).
// Each item has an id made on the device, so uploading twice never makes a duplicate.

const KEY = 'appFeedback';
export const CATEGORIES = ['idea', 'problem', 'content', 'praise', 'other'];
export const MAX_LENGTH = 1000;

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage unavailable: nothing to save
  }
};

const newId = () =>
  (globalThis.crypto?.randomUUID?.() ??
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 3) | 8).toString(16);
    }));

// Newest first.
export const loadFeedback = () => read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

// Feedback about one lesson (shown when she finishes it). The message is optional for these.
export const LESSON_CATEGORY = 'lesson';
const COURSES = ['health', 'finance'];

export const validate = ({ rating, category, message, course, lessonId }) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'rating';
  const text = (message || '').trim();
  if (category === LESSON_CATEGORY) {
    if (!COURSES.includes(course) || lessonId == null || String(lessonId).length > 20) return 'lesson';
    return text.length > MAX_LENGTH ? 'long' : null;
  }
  if (!CATEGORIES.includes(category)) return 'category';
  if (!text) return 'message';
  if (text.length > MAX_LENGTH) return 'long';
  return null;
};

// Uploads everything that has not gone up yet. Returns true if the account now has all of it.
export const pushPendingFeedback = async () => {
  const list = read();
  const pending = list.filter((f) => !f.sent);
  if (!pending.length) return true;
  let accountId;
  try {
    accountId = await currentAccountId();
  } catch {
    return false;
  }
  if (!accountId) return false; // guest: stays on this device for now

  // course / lesson_id are only sent for lesson feedback, so ordinary feedback also works before migration 0003 is run
  const rows = pending.map((f) => ({
    id: f.id, account_id: accountId, rating: f.rating, category: f.category, message: f.message, created_at: f.createdAt,
    ...(f.category === LESSON_CATEGORY ? { course: f.course, lesson_id: String(f.lessonId) } : {}),
  }));
  const { error } = await supabase.from('feedback').upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
  if (error) return false;
  const ids = new Set(pending.map((f) => f.id));
  write(read().map((f) => (ids.has(f.id) ? { ...f, sent: true } : f)));
  return true;
};

// Brings in feedback this account sent from another device.
export const pullRemoteFeedback = async () => {
  let accountId;
  try {
    accountId = await currentAccountId();
  } catch {
    return;
  }
  if (!accountId) return;
  const { data, error } = await supabase.from('feedback').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(200);
  if (error || !data) return;
  const have = new Set(read().map((f) => f.id));
  const fresh = data.filter((r) => !have.has(r.id)).map((r) => ({ id: r.id, rating: r.rating, category: r.category, message: r.message, createdAt: r.created_at, sent: true, ...(r.category === LESSON_CATEGORY ? { course: r.course, lessonId: normLesson(r.lesson_id) } : {}) }));
  if (fresh.length) write([...read(), ...fresh]);
};

const normLesson = (v) => (/^\d+$/.test(String(v)) ? Number(v) : String(v));

export const hasLessonFeedback = (course, lessonId) =>
  read().some((f) => f.category === LESSON_CATEGORY && f.course === course && String(f.lessonId) === String(lessonId));

export const addFeedback = async ({ rating, category, message = '', course, lessonId }) => {
  const problem = validate({ rating, category, message, course, lessonId });
  if (problem) throw new Error(problem);
  const item = {
    id: newId(), rating, category, message: message.trim(), createdAt: new Date().toISOString(), sent: false,
    ...(category === LESSON_CATEGORY ? { course, lessonId } : {}),
  };
  write([...read(), item]);
  const uploaded = await pushPendingFeedback().catch(() => false);
  return { ...item, sent: uploaded };
};

export const removeFeedback = async (id) => {
  const item = read().find((f) => f.id === id);
  write(read().filter((f) => f.id !== id));
  if (item?.sent && supabase) {
    try {
      await supabase.from('feedback').delete().eq('id', id);
    } catch {
      // it will simply still be on the account; nothing more to do
    }
  }
};
