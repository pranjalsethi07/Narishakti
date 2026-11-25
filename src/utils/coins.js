import { useEffect, useRef, useState } from 'react';
import { COIN_EARNED_EVENT, COIN_EVENT, COIN_LANDED_EVENT, balanceOf, readLedger, writeLedger } from '../lib/coinLedger';
import { notifyProgressChanged } from '../lib/sync';
import { applyStreakRestore, getRestorableStreak, todayString } from './userProgress';

// The coin bag. Coins are earned (a lesson finished, today's question answered) and spent
// (winning back a broken streak). The bag is a ledger, so nothing is counted twice.
export const COIN_RULES = { lesson: 50, daily: 10 };
export const RESTORE_COSTS = [100, 200, 300]; // 1st, 2nd and 3rd restore in a calendar month
export const MAX_RESTORES_PER_MONTH = RESTORE_COSTS.length;

const monthKey = () => todayString().slice(0, 7); // 2026-11

export const getBalance = () => balanceOf(readLedger());
export const getLedgerNewestFirst = () => readLedger().sort((a, b) => String(b.at).localeCompare(String(a.at)));

// Adds coins for something that happened. The id says what happened, so asking twice is harmless.
// Returns true only the first time (so the screen can say "+50 coins" once).
export const awardCoins = (id, kind, amount) => {
  const ledger = readLedger();
  if (ledger.some((e) => e.id === id)) return false;
  // tell the screen first, so the header wallet waits for the coins to fly in before it counts them
  window.dispatchEvent(new CustomEvent(COIN_EARNED_EVENT, { detail: { amount } }));
  writeLedger([...ledger, { id, kind, amount, at: new Date().toISOString() }]);
  notifyProgressChanged();
  return true;
};

export const awardLessonCoins = (courseId, lessonId) => awardCoins(`lesson:${courseId}:${lessonId}`, 'lesson', COIN_RULES.lesson);
export const awardDailyCoins = () => awardCoins(`daily:${todayString()}`, 'daily', COIN_RULES.daily);
export const hasClaimedDaily = () => readLedger().some((e) => e.id === `daily:${todayString()}`);

// What a streak restore would cost right now, and whether it can be done.
export const getRestoreOffer = () => {
  const ledger = readLedger();
  const month = monthKey();
  const used = ledger.filter((e) => e.kind === 'restore' && e.id.startsWith(`restore:${month}:`)).length;
  const lost = getRestorableStreak();
  const cost = used < MAX_RESTORES_PER_MONTH ? RESTORE_COSTS[used] : null;
  const balance = balanceOf(ledger);
  return {
    lost, // null when no streak is waiting to be restored
    used,
    left: MAX_RESTORES_PER_MONTH - used,
    cost, // null when this month's three restores are used up
    balance,
    canRestore: Boolean(lost) && cost != null && balance >= cost,
  };
};

// Spends the coins and brings the streak back. Returns { ok: true, streak, cost } or { ok: false, reason }.
export const restoreStreak = () => {
  const offer = getRestoreOffer();
  if (!offer.lost) return { ok: false, reason: 'nothing' };
  if (offer.cost == null) return { ok: false, reason: 'limit' };
  if (offer.balance < offer.cost) return { ok: false, reason: 'coins' };

  // the id carries the month and which restore this is, so two devices cannot both spend the same one
  const id = `restore:${monthKey()}:${offer.used + 1}`;
  const ledger = readLedger();
  if (ledger.some((e) => e.id === id)) return { ok: false, reason: 'limit' };
  const streak = applyStreakRestore();
  if (streak == null) return { ok: false, reason: 'nothing' };
  writeLedger([...ledger, { id, kind: 'restore', amount: -offer.cost, at: new Date().toISOString() }]);
  notifyProgressChanged();
  return { ok: true, streak, cost: offer.cost };
};

// For screens that show the balance: updates when coins change (this tab, or after a sync).
export const useCoinBalance = () => {
  const [balance, setBalance] = useState(getBalance);
  useEffect(() => {
    const refresh = () => setBalance(getBalance());
    window.addEventListener(COIN_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('naari-progress-synced', refresh);
    return () => {
      window.removeEventListener(COIN_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('naari-progress-synced', refresh);
    };
  }, []);
  return balance;
};

// For the header wallet: like useCoinBalance, but after coins are earned it keeps the old number
// until the flying coins land (or 3 seconds pass), so the count goes up as they arrive.
export const useWalletBalance = () => {
  const [shown, setShown] = useState(getBalance);
  const hold = useRef(null);
  useEffect(() => {
    const release = () => {
      clearTimeout(hold.current);
      hold.current = null;
      setShown(getBalance());
    };
    const onEarned = () => {
      clearTimeout(hold.current);
      hold.current = setTimeout(release, 3000);
    };
    const onChange = () => {
      if (hold.current == null) setShown(getBalance());
    };
    window.addEventListener(COIN_EARNED_EVENT, onEarned);
    window.addEventListener(COIN_LANDED_EVENT, release);
    window.addEventListener(COIN_EVENT, onChange);
    window.addEventListener('storage', onChange);
    window.addEventListener('naari-progress-synced', onChange);
    return () => {
      clearTimeout(hold.current);
      window.removeEventListener(COIN_EARNED_EVENT, onEarned);
      window.removeEventListener(COIN_LANDED_EVENT, release);
      window.removeEventListener(COIN_EVENT, onChange);
      window.removeEventListener('storage', onChange);
      window.removeEventListener('naari-progress-synced', onChange);
    };
  }, []);
  return shown;
};
