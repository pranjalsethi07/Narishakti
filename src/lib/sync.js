import { useSyncExternalStore } from 'react';
import { supabase } from './supabaseClient';
import { mergeSnapshots, normId, rowsFromSnapshot, snapshotFromRemote, stableStringify } from './syncMerge';

// Local-first sync. The app keeps reading and writing localStorage exactly as before, so it
// works offline and instantly. This file mirrors that progress to the cloud in the background:
//   pull what the account already has -> merge with this device -> save the result both places.
// Nothing here is needed for the app to work; if Supabase is not set up it does nothing.

// Where the app keeps each piece of progress (the same keys the rest of the code uses).
const KEYS = {
  learn: 'learnProgress',
  steps: 'learnSteps',
  games: 'gameProgress',
  tests: 'testResults',
  streak: 'dailyStreakMeta',
  questions: 'questionsAskedCount',
  age: 'userAge',
  lang: 'appLang',
};
export const PROGRESS_STORAGE_KEYS = [KEYS.learn, KEYS.steps, KEYS.games, KEYS.tests, KEYS.streak, KEYS.questions];

const SYNCED_EVENT = 'naari-progress-synced';

// ---------------------------------------------------------------- status (for the UI)
let status = { state: supabase ? 'idle' : 'off', lastSyncedAt: null };
const listeners = new Set();
const setStatus = (patch) => {
  status = { ...status, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
// state: off | idle | syncing | synced | offline | error
export const useSyncStatus = () => useSyncExternalStore(subscribe, () => status, () => status);

// ---------------------------------------------------------------- reading and writing this device
const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const readText = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

const readLocal = () => {
  const learnRaw = readJson(KEYS.learn, {}) || {};
  const learn = {};
  Object.entries(learnRaw).forEach(([course, ids]) => {
    if (Array.isArray(ids)) learn[course] = ids.map(normId);
  });
  return {
    learn,
    steps: readJson(KEYS.steps, {}) || {},
    games: readJson(KEYS.games, {}) || {},
    tests: readJson(KEYS.tests, {}) || {},
    streak: readJson(KEYS.streak, null),
    questions: Number(readText(KEYS.questions)) || 0,
    age: readText(KEYS.age),
    lang: readText(KEYS.lang),
  };
};

// Writes the merged result back, touching only what actually changed.
const writeLocal = (snap) => {
  let changed = false;
  const put = (key, value) => {
    try {
      const next = typeof value === 'string' ? value : JSON.stringify(value);
      if (localStorage.getItem(key) !== next) {
        localStorage.setItem(key, next);
        changed = true;
      }
    } catch {
      // storage unavailable: nothing to write
    }
  };

  // Keep the app's own formats: learnProgress always carries health and finance.
  put(KEYS.learn, { health: [], finance: [], ...snap.learn });
  put(KEYS.steps, snap.steps);
  put(KEYS.games, snap.games);
  put(KEYS.tests, snap.tests);
  if (snap.streak) put(KEYS.streak, snap.streak);
  put(KEYS.questions, String(snap.questions || 0));
  // Age and language are only filled in when this device has none (a freshly restored phone).
  if (!readText(KEYS.age) && snap.age) put(KEYS.age, snap.age);
  if (!readText(KEYS.lang) && snap.lang) put(KEYS.lang, snap.lang);

  if (changed) window.dispatchEvent(new Event(SYNCED_EVENT));
  return changed;
};

// ---------------------------------------------------------------- session and account
// Guests have no account, so nothing is backed up and nothing is created for them.
class NotSignedInError extends Error {}

// The signed-in user's id. Throws NotSignedInError for a guest.
const ensureSession = async () => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (user && !user.is_anonymous) return user.id;
  throw new NotSignedInError('not signed in');
};

let accountCache = { userId: null, accountId: null };

// Forget everything remembered about the previous user (after signing out or in as someone else).
export const forgetSyncState = () => {
  accountCache = { userId: null, accountId: null };
  lastPushed = '';
};
const getAccountId = async () => {
  const userId = await ensureSession();
  if (accountCache.userId === userId && accountCache.accountId) return accountCache.accountId;
  const { data, error } = await supabase.rpc('ensure_account');
  if (error) throw error;
  accountCache = { userId, accountId: data };
  return data;
};

// ---------------------------------------------------------------- one full sync
let lastPushed = '';

const fetchRemote = async (accountId) => {
  const [profile, lessons, games, tests] = await Promise.all([
    supabase.from('profiles').select('*').eq('account_id', accountId).maybeSingle(),
    supabase.from('lesson_progress').select('*').eq('account_id', accountId),
    supabase.from('game_progress').select('*').eq('account_id', accountId),
    supabase.from('test_results').select('*').eq('account_id', accountId),
  ]);
  const failed = [profile, lessons, games, tests].find((r) => r.error);
  if (failed) throw failed.error;
  return snapshotFromRemote({ profile: profile.data, lessons: lessons.data, games: games.data, tests: tests.data });
};

const pushRows = async (rows) => {
  const writes = [supabase.from('profiles').upsert(rows.profile, { onConflict: 'account_id' })];
  if (rows.lessons.length) writes.push(supabase.from('lesson_progress').upsert(rows.lessons, { onConflict: 'account_id,course,lesson_id' }));
  if (rows.games.length) writes.push(supabase.from('game_progress').upsert(rows.games, { onConflict: 'account_id,game,level' }));
  if (rows.tests.length) writes.push(supabase.from('test_results').upsert(rows.tests, { onConflict: 'account_id,topic' }));
  const results = await Promise.all(writes);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
};

const syncNow = async () => {
  if (!supabase) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setStatus({ state: 'offline' });
    return;
  }

  setStatus({ state: 'syncing' });
  try {
    const accountId = await getAccountId();
    const remote = await fetchRemote(accountId);

    // The device is read only AFTER the network call returns, and the read, merge and write
    // below are all synchronous, so anything she did while we were waiting is kept.
    const merged = mergeSnapshots(readLocal(), remote);
    writeLocal(merged);

    const rows = rowsFromSnapshot(accountId, merged, new Date().toISOString());
    const blank = (row) => ({ ...row, updated_at: '' }); // the timestamp always differs; ignore it
    const fingerprint = stableStringify({ profile: blank(rows.profile), lessons: rows.lessons.map(blank), games: rows.games.map(blank), tests: rows.tests });
    if (fingerprint !== lastPushed) {
      await pushRows(rows);
      lastPushed = fingerprint;
    }
    setStatus({ state: 'synced', lastSyncedAt: Date.now() });
  } catch (error) {
    if (error instanceof NotSignedInError) {
      setStatus({ state: 'guest' }); // not an error: a guest simply has no backup
      return;
    }
    console.warn('Progress sync failed:', error?.message || error);
    setStatus({ state: navigator.onLine === false ? 'offline' : 'error' });
  }
};

// ---------------------------------------------------------------- when to sync
let timer = null;
let running = false;
let queued = false;

const runSync = async () => {
  if (running) {
    queued = true; // one more pass after this one finishes
    return;
  }
  running = true;
  try {
    await syncNow();
  } finally {
    running = false;
    if (queued) {
      queued = false;
      scheduleSync(500);
    }
  }
};

const scheduleSync = (delay = 1500) => {
  clearTimeout(timer);
  timer = setTimeout(runSync, delay);
};

// Call after any progress is saved. Waits a moment so a burst of changes is one upload.
export const notifyProgressChanged = () => {
  if (supabase) scheduleSync(1500);
};

let started = false;
export const startSync = () => {
  if (started || !supabase) return;
  started = true;
  scheduleSync(0);

  // Start backing up the moment she signs in; forget everything when she signs out.
  // (Only schedule work inside this callback; never call Supabase from it directly.)
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      forgetSyncState();
      scheduleSync(0);
    } else if (event === 'SIGNED_OUT') {
      forgetSyncState();
      setStatus({ state: 'guest' });
    }
  });

  window.addEventListener('online', () => scheduleSync(500));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') scheduleSync(0); // she is leaving: save now
  });
};

export const syncNowManually = () => runSync();

// True when this device holds any lessons, steps, game levels, test results or questions.
export const hasLocalProgress = () => {
  const s = readLocal();
  return (
    Object.values(s.learn).some((ids) => ids.length > 0) ||
    Object.keys(s.steps).length > 0 ||
    Object.keys(s.games).length > 0 ||
    Object.keys(s.tests).length > 0 ||
    s.questions > 0
  );
};

// Wipes progress from this device only (used when she chooses not to carry guest progress into an account).
export const clearLocalProgress = () => {
  PROGRESS_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage unavailable: nothing to clear
    }
  });
};

// ---------------------------------------------------------------- recovery code and deleting
const requireClient = () => {
  if (!supabase) throw new Error('Cloud backup is not set up.');
};

// Makes a new recovery code. The plain code is returned once and never stored.
export const createRecoveryCode = async () => {
  requireClient();
  await getAccountId();
  const { data, error } = await supabase.rpc('create_recovery_code');
  if (error) throw error;
  return data;
};

// When the current recovery code was made, or null if there is none.
export const getRecoveryCodeDate = async () => {
  requireClient();
  await getAccountId();
  const { data, error } = await supabase.rpc('recovery_code_created_at');
  if (error) throw error;
  return data ? new Date(data) : null;
};

// Joins this device to the account that owns the code, then merges its progress with this one.
// Returns false if the code is not recognised.
export const restoreWithCode = async (code) => {
  requireClient();
  await ensureSession();
  const { data, error } = await supabase.rpc('link_device_with_code', { p_code: code });
  if (error) throw error;
  if (!data) return false;
  accountCache = { userId: null, accountId: null };
  lastPushed = '';
  await syncNow();
  return true;
};

// Deletes everything we hold for this account. The caller clears the device afterwards.
export const deleteMyData = async () => {
  requireClient();
  await ensureSession();
  const { error } = await supabase.rpc('delete_my_data');
  if (error) throw error;
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // the account is already gone; nothing more to do
  }
};
