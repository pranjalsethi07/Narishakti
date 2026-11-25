import { notifyProgressChanged } from '../lib/sync';

// Test Your Knowledge results, kept per topic: { health: { best, total, attempts, lastAt } }.
// The app did not save these before; now they are kept on the device and backed up.
const KEY = 'testResults';

export const getTestResults = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
};

export const saveTestResult = (topic, score, total) => {
  try {
    const all = getTestResults();
    const previous = all[topic];
    all[topic] = {
      best: Math.max(previous?.best || 0, score),
      total,
      attempts: (previous?.attempts || 0) + 1,
      lastAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(all));
    notifyProgressChanged();
  } catch {
    // storage unavailable: the result just is not remembered
  }
};
