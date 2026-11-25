import { Capacitor } from '@capacitor/core';

// "Mobile mode" means: show the phone version (everything under /m) instead of the wide website.
// It turns on only when you open an /m address, and is always on inside the installed (Capacitor) app.
const KEY = 'naariMobileMode';
const inMobileArea = (path) => path === '/m' || path.startsWith('/m/');

export const isNativeApp = () => {
  try { return Capacitor.isNativePlatform(); } catch { return false; }
};

export const isMobileMode = () => {
  if (isNativeApp()) return true;
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};

export const setMobileMode = (on) => {
  try {
    if (on) sessionStorage.setItem(KEY, '1');
    else sessionStorage.removeItem(KEY);
  } catch { /* storage unavailable: the mode just lasts until the next full reload */ }
};

// A fresh page load that is not on an /m address (for example typing localhost:5173) starts as the normal website.
if (typeof window !== 'undefined' && !inMobileArea(window.location.pathname)) setMobileMode(false);

// Address to use for a full page load (location.href = ...), staying in the phone version when you are in it.
export const appUrl = (path) => {
  if (!isMobileMode()) return path;
  if (path === '/') return '/m';
  return path.startsWith('/dashboard') ? `/m${path}` : path;
};
