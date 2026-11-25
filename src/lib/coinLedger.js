// The coin ledger: a list of {id, kind, amount, at}. Every coin earned or spent is one entry, and
// the balance is the sum. Entry ids describe the event ('lesson:health:3'), so the same event can
// never be counted twice, on one device or across devices (merging is just "union by id").
// No network here and no import of sync.js, so sync.js can use it without a cycle.

const KEY = 'coinLedger';
export const COIN_EVENT = 'naari-coins-changed';
export const COIN_EARNED_EVENT = 'naari-coins-earned'; // coins were just earned: play the flight
export const COIN_LANDED_EVENT = 'naari-coins-landed'; // the flight ended: the wallet may update

const isEntry = (e) => e && typeof e.id === 'string' && Number.isInteger(e.amount) && e.amount !== 0 && typeof e.kind === 'string';

export const readLedger = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter(isEntry) : [];
  } catch {
    return [];
  }
};

export const writeLedger = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(COIN_EVENT));
  } catch {
    // storage unavailable: coins last for this visit only
  }
};

// Two ledgers joined without losing or doubling anything. The older timestamp wins for an id both have.
export const mergeLedgers = (a, b) => {
  const byId = new Map();
  [...a, ...b].forEach((e) => {
    const have = byId.get(e.id);
    if (!have || String(e.at) < String(have.at)) byId.set(e.id, e);
  });
  return [...byId.values()].sort((x, y) => String(x.at).localeCompare(String(y.at)));
};

export const balanceOf = (list) => Math.max(0, list.reduce((sum, e) => sum + e.amount, 0));

export const fromRemoteRows = (rows = []) => rows.map((r) => ({ id: r.id, kind: r.kind, amount: r.amount, at: r.created_at }));
// Only entries the database accepts are uploaded, so one odd local value can never block the rest.
const SYNCABLE = { lesson: (n) => n === 50, daily: (n) => n === 10, restore: (n) => [-100, -200, -300].includes(n) };
const isSyncable = (e) => SYNCABLE[e.kind]?.(e.amount) && e.id.length <= 80 && !Number.isNaN(Date.parse(e.at));
export const toRemoteRows = (accountId, list) => list.filter(isSyncable).map((e) => ({ account_id: accountId, id: e.id, kind: e.kind, amount: e.amount, created_at: e.at }));
