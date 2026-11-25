// Pure helpers for progress sync: no storage, no network. That keeps them easy to test.
//
// A "snapshot" is everything we back up, in the same shape the app keeps in localStorage:
//   learn:     { health: [1, 2], finance: [1] }          lessons finished, per course
//   steps:     { 'health-2': ['watch', 'read'] }         steps done inside a lesson
//   games:     { memory: { 1: 3, 2: 2 } }                best stars per game level
//   tests:     { health: { best, total, attempts, lastAt } }
//   streak:    { streak, lastActiveDate } | null
//   questions: number
//   age, lang: strings (the only profile details that leave the device)

export const emptySnapshot = () => ({ learn: {}, steps: {}, games: {}, tests: {}, streak: null, questions: 0, age: '', lang: '' });

// Lesson ids are numbers in the app and text in the database. Make them the same everywhere.
export const normId = (value) => (/^\d+$/.test(String(value)) ? Number(value) : String(value));

const uniq = (list) => [...new Set(list)];

const mergeTest = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  const first = a.best > b.best || (a.best === b.best && a.total >= b.total) ? a : b;
  return {
    best: first.best,
    total: first.total,
    attempts: Math.max(a.attempts || 0, b.attempts || 0),
    lastAt: [a.lastAt, b.lastAt].filter(Boolean).sort().pop() || '',
  };
};

// The streak that was active more recently wins; on the same day, the longer one.
const pickStreak = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  const dateA = a.lastActiveDate || '';
  const dateB = b.lastActiveDate || '';
  if (dateA !== dateB) return dateA > dateB ? a : b;
  return (a.streak || 0) >= (b.streak || 0) ? a : b;
};

// Combine two snapshots without losing anything either has: lessons and steps are joined,
// game stars and test scores keep the best, questions keep the highest count.
export const mergeSnapshots = (a, b) => {
  const learn = {};
  new Set([...Object.keys(a.learn), ...Object.keys(b.learn)]).forEach((course) => {
    learn[course] = uniq([...(a.learn[course] || []), ...(b.learn[course] || [])].map(normId));
  });

  const steps = {};
  new Set([...Object.keys(a.steps), ...Object.keys(b.steps)]).forEach((key) => {
    steps[key] = uniq([...(a.steps[key] || []), ...(b.steps[key] || [])]);
  });

  const games = {};
  new Set([...Object.keys(a.games), ...Object.keys(b.games)]).forEach((game) => {
    games[game] = {};
    new Set([...Object.keys(a.games[game] || {}), ...Object.keys(b.games[game] || {})]).forEach((level) => {
      games[game][level] = Math.max(Number(a.games[game]?.[level]) || 0, Number(b.games[game]?.[level]) || 0);
    });
  });

  const tests = {};
  new Set([...Object.keys(a.tests), ...Object.keys(b.tests)]).forEach((topic) => {
    tests[topic] = mergeTest(a.tests[topic], b.tests[topic]);
  });

  return {
    learn,
    steps,
    games,
    tests,
    streak: pickStreak(a.streak, b.streak),
    questions: Math.max(a.questions || 0, b.questions || 0),
    age: a.age || b.age || '',
    lang: a.lang || b.lang || '',
  };
};

// Same content, whatever the key order. Used to skip saving or uploading when nothing changed.
export const stableStringify = (value) => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

// ---- database rows <-> snapshot ----------------------------------------------------------

export const snapshotFromRemote = ({ profile, lessons = [], games = [], tests = [] }) => {
  const snap = emptySnapshot();

  lessons.forEach((row) => {
    const id = normId(row.lesson_id);
    if (row.done) snap.learn[row.course] = uniq([...(snap.learn[row.course] || []), id]);
    if (row.steps?.length) snap.steps[`${row.course}-${row.lesson_id}`] = row.steps;
  });

  games.forEach((row) => {
    snap.games[row.game] = { ...(snap.games[row.game] || {}), [row.level]: row.stars };
  });

  tests.forEach((row) => {
    snap.tests[row.topic] = { best: row.best_score, total: row.total, attempts: row.attempts, lastAt: row.last_attempt_at || '' };
  });

  if (profile) {
    if (profile.last_active_date) snap.streak = { streak: profile.streak || 0, lastActiveDate: profile.last_active_date };
    snap.questions = profile.questions_asked || 0;
    snap.age = profile.age_group || '';
    snap.lang = profile.language || '';
  }
  return snap;
};

const AGE_PATTERN = /^[0-9]{1,2}(-[0-9]{1,2}|\+)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const clampInt = (value, min, max) => Math.min(max, Math.max(min, Math.trunc(Number(value) || 0)));

// Rows ready to upsert. Anything that would break a database rule is dropped or clamped,
// so one odd value on the device can never make the whole upload fail.
export const rowsFromSnapshot = (accountId, snap, nowIso) => {
  const lessonRows = new Map();
  const slot = (course, id) => {
    const key = `${course}|${id}`;
    if (!lessonRows.has(key)) {
      lessonRows.set(key, { account_id: accountId, course, lesson_id: String(id), done: false, steps: [], updated_at: nowIso });
    }
    return lessonRows.get(key);
  };

  Object.entries(snap.learn).forEach(([course, ids]) => ids.forEach((id) => { slot(course, id).done = true; }));
  Object.entries(snap.steps).forEach(([key, list]) => {
    const cut = key.lastIndexOf('-');
    if (cut < 1) return;
    slot(key.slice(0, cut), key.slice(cut + 1)).steps = uniq(list).slice(0, 10);
  });

  const gameRows = [];
  Object.entries(snap.games).forEach(([game, levels]) => {
    Object.entries(levels).forEach(([level, stars]) => {
      const lvl = Number(level);
      const st = Number(stars);
      if (lvl >= 1 && lvl <= 50 && st >= 1 && st <= 3) gameRows.push({ account_id: accountId, game, level: lvl, stars: st, updated_at: nowIso });
    });
  });

  const testRows = [];
  Object.entries(snap.tests).forEach(([topic, t]) => {
    const total = clampInt(t.total, 1, 200);
    testRows.push({
      account_id: accountId,
      topic,
      best_score: Math.min(clampInt(t.best, 0, 200), total),
      total,
      attempts: clampInt(t.attempts || 1, 1, 100000),
      last_attempt_at: t.lastAt || nowIso,
    });
  });

  const profileRow = {
    account_id: accountId,
    age_group: AGE_PATTERN.test(snap.age || '') ? snap.age : null,
    language: snap.lang === 'en' || snap.lang === 'hi' ? snap.lang : null,
    streak: clampInt(snap.streak?.streak, 0, 100000),
    last_active_date: DATE_PATTERN.test(snap.streak?.lastActiveDate || '') ? snap.streak.lastActiveDate : null,
    questions_asked: clampInt(snap.questions, 0, 10000000),
    updated_at: nowIso,
  };

  return { lessons: [...lessonRows.values()], games: gameRows, tests: testRows, profile: profileRow };
};
