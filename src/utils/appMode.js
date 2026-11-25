import { Capacitor } from '@capacitor/core';

// "Mobile mode" means: show the app-style /m screens instead of the wide /dashboard ones.
// It turns on when you open any /m address, and always on inside the installed (Capacitor) app.
const KEY = 'naariMobileMode';

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
